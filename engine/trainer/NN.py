import sys
import os

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

import tensorflow as tf
from datetime import datetime
from keras.models import Model
from keras.layers import Embedding, \
    Dense, Dot, Input, Reshape, \
    Dropout, Concatenate, Conv1D, \
    GlobalMaxPool1D, GlobalAveragePooling1D, \
    MaxPool1D, AveragePooling1D, BatchNormalization, \
    Flatten, LeakyReLU, Reshape, Lambda
from keras.models import load_model, model_from_json
from keras.optimizers import Adam, Nadam
from keras.metrics import mae
from keras import callbacks, regularizers
from keras.regularizers import l2
from keras.utils import to_categorical, multi_gpu_model
from keras.backend.tensorflow_backend import set_session
from generator import Generator
from sklearn import preprocessing
from keras import backend as K
import keras
from sklearn.preprocessing import MultiLabelBinarizer

from utils import calculate_ndcg

def root_mean_squared_error(y_true, y_pred):
    return K.sqrt(K.mean(K.square(y_pred - y_true)))

class NN(object):

    def __init__(self, ratings, movies, batch_size=2**10, embedding_user=100, embedding_movies=100, embedding_genres=20):
        
        self.batch_size = batch_size
        self.embedding_user = embedding_user
        self.embedding_movies = embedding_movies
        self.embedding_genres = embedding_genres

        self.n_users = len(ratings['userId'].unique())
        self.n_movies = len(ratings['movieId'].unique())

        genres = list(set([j for i in movies['genres'].values for j in i.split('|')]))
        self.n_genres = len(genres)

        one_hot = MultiLabelBinarizer()
        movies['genreEmbedding'] = [tuple(x) for x in one_hot.fit_transform(movies['genres'].map(lambda x: x.split('|'))).tolist()]
        ratings['genreEmbedding'] = movies.merge(ratings, on='movieId')[['genreEmbedding']]

        usersMap = {x:idx for idx,x in enumerate(ratings['userId'].drop_duplicates().values.tolist())}
        moviesMap = {x:idx for idx,x in enumerate(ratings['movieId'].drop_duplicates().values.tolist())}

        ratings['userEmbeddingId'] = ratings['userId'].map(usersMap).fillna(ratings['userId'])
        ratings['movieEmbeddingId'] = ratings['movieId'].map(moviesMap).fillna(ratings['movieId'])

        self.user_avg_ratings = {idx:x for idx,x in enumerate(ratings.groupby(['userEmbeddingId'])['rating'].mean().values.tolist())}
        self.movie_avg_ratings = {idx:x for idx,x in enumerate(ratings.groupby(['movieEmbeddingId'])['rating'].mean().values.tolist())}

        shuffled_ratings = ratings.sample(frac=1., random_state=24)

        self.ratings = shuffled_ratings
        print(self.ratings.head(20))

        self.train, self.test = train_test_split(shuffled_ratings, test_size=0.1)

        self.movies = movies

        self.build_model()

    def build_model(self):
        w_reg = 1e-7
        # w_reg = 1e-6
        a_reg = 1e-7

        def dense():
            return {
                "kernel_initializer":'he_normal',
                "kernel_regularizer": l2(w_reg),
                # "activity_regularizer": l2(a_reg)
            }
        
        def embedding(input_dim, output_dim):
            return {
                "input_dim": input_dim+1,
                "output_dim": output_dim,
                "input_length": 1,
                "embeddings_initializer": 'he_normal',
                "embeddings_regularizer": l2(w_reg),
            }
        
        user = Input(name='user', shape=[1])
        user_avg_rating = Input(name='user_avg_rating', shape=[1])
        reshaped_user_avg_rating = Reshape((1,1))(user_avg_rating)

        movie = Input(name='movie', shape=[1])
        movie_avg_rating = Input(name='movie_avg_rating', shape=[1])
        reshaped_movie_avg_rating = Reshape((1,1))(movie_avg_rating)

        genres = Input(name='genre', shape=[self.n_genres])

        user_embedding = Embedding(
            name="user_embedding",
            **embedding(self.n_users, self.embedding_user)
        )(user)
        user_embedding = Dropout(0.3)(user_embedding)
        user_embedding = BatchNormalization()(user_embedding)
        user_embedding = Concatenate(axis=2)([user_embedding, reshaped_user_avg_rating])
        
        movies_embedding = Embedding(
            name='movies_embedding',
            **embedding(self.n_movies, self.embedding_movies)
        )(movie)
        movies_embedding = Dropout(0.3)(movies_embedding)
        movies_embedding = BatchNormalization()(movies_embedding)
        movies_embedding = Concatenate(axis=2)([movies_embedding, reshaped_movie_avg_rating])

        genre_embedding = Dense(
            self.embedding_genres,
            name='genre_embedding',
            **dense()
        )(genres)
        genre_embedding = LeakyReLU()(genre_embedding)
        genre_embedding = Dropout(0.3)(genre_embedding)
        genre_embedding = BatchNormalization()(genre_embedding)
        genre_embedding = Reshape((1, self.n_genres))(genre_embedding)

        merged_embedding = Flatten()(Concatenate(axis=2)([user_embedding, movies_embedding, genre_embedding]))

        dense_1 = Dense(2048, **dense())(merged_embedding)
        dense_1 = LeakyReLU()(dense_1)
        dense_1 = Dropout(0.4)(dense_1)
        dense_1 = BatchNormalization()(dense_1)

        dense_2 = Dense(1024, **dense())(dense_1)
        dense_2 = LeakyReLU()(dense_2)
        dense_2 = Dropout(0.4)(dense_2)
        dense_2 = BatchNormalization()(dense_2)

        dense_3 = Dense(512, **dense())(dense_2)
        dense_3 = LeakyReLU()(dense_3)
        dense_3 = Dropout(0.4)(dense_3)
        dense_3 = BatchNormalization()(dense_3)

        dense_4 = Dense(256, **dense())(dense_3)
        dense_4 = LeakyReLU()(dense_4)
        dense_4 = Dropout(0.4)(dense_4)
        dense_4 = BatchNormalization()(dense_4)

        dense_5 = Dense(128, **dense())(dense_4)
        dense_5 = LeakyReLU()(dense_5)
        dense_5 = Dropout(0.4)(dense_5)
        dense_5 = BatchNormalization()(dense_5)

        out = Dense(1)(dense_5)

        config = tf.ConfigProto()
        config.gpu_options.allow_growth = True
        set_session(tf.Session(config=config))

        gpus = os.environ.get('CUDA_VISIBLE_DEVICES', '').split(',')

        self.model = Model(inputs = [user, user_avg_rating, movie, movie_avg_rating, genres], outputs = out)
        print(self.model.summary())

        nadam = Nadam(lr=2e-4, epsilon=1e-4)
        if(len(gpus) > 1 ):
            with tf.device("/cpu:0"):
                self.s_model = Model(inputs = [user, user_avg_rating, movie, movie_avg_rating, genres], outputs = out)
                self.model = multi_gpu_model(self.s_model, gpus=len(gpus))
                self.batch_size = self.batch_size * len(gpus)
                self.s_model.compile(optimizer=nadam, loss=root_mean_squared_error, metrics=['mae'])
        # Minimize rmse
        self.model.compile(optimizer=nadam, loss=root_mean_squared_error, metrics=['mae'])

    def train_model(self, epochs=100):
        print('# Fit model on training data')

        _callbacks = [
            callbacks.TensorBoard(log_dir='./Graph', histogram_freq=0, write_graph=True, write_images=True),
            callbacks.EarlyStopping('val_loss', patience=6),
        ] 

        train_gen = Generator(self.train, self.user_avg_ratings, self.movie_avg_ratings, self.batch_size)
        validate_gen = Generator(self.test, self.user_avg_ratings, self.movie_avg_ratings, self.batch_size)

        history = self.model.fit_generator(
            generator=train_gen,
            validation_data=validate_gen,
            epochs=epochs,
            callbacks=_callbacks,
            workers=12,
            max_queue_size=200,
            shuffle=True,
            use_multiprocessing=True
        )
        print('\nhistory dict:', history.history)
        self.save_history(history.history)
        try:
            self.s_model.save_weights('model.h5')
        except AttributeError:
            print('Saving single gpu model')
            self.model.save_weights('model.h5')
        
    def save_history(self, history):
        pd.DataFrame(history).to_csv('train_history/' + str(datetime.now()) + '.csv')

    def test_model(self):
        # Evaluate the model on the test data using `evaluate`
        print('\n# Evaluate on test data')

        test_gen = self.batch_generator(self.test, batch_size=self.batch_size)

        results = self.model.evaluate_generator(test_gen, steps=(len(self.test) // self.batch_size))
        print('test loss, test acc:', results)
    
    def load_model(self, path):
        self.model.load_weights(path)
    
    def get_embeddings(embedding_name):
        try:
            self.model
        except AttributeError:
            print('Error please load a model first')
        
        movie_embeddings = self.model.get_weights('movie_embedding')
        user_embeddings = self.model.get_weights('user_embedding')

    def predict(self, uid, numRatings):
        ratings = self.ratings
        movies = self.movies
        user_embedding_id = ratings[ratings['userId'] == uid]['userEmbeddingId'].drop_duplicates().values

        user_avg_rating = self.user_avg_ratings.get(user_embedding_id)

        cadidates = ratings[~ratings['movieId'].isin(ratings['userId'] == uid)]
    
        movieEmbIds = cadidates[['movieEmbeddingId']].drop_duplicates()
        movieAvgRatings = np.array([self.movie_avg_ratings.get(i) for i in movieEmbIds.tolist()])
        genreEmbeddings = np.array(list(map(lambda x: np.array(x), candidates.loc[:]['genreEmbedding'].values)))
        userEmbeddingIds = [user_embedding for _ in range(0,len(movieEmbIds))]

        userAvgRatings = [user_avg_rating for _ in range(0, len(movieEmbIds))]
        movieAvgRatings = [self.movie_avg_ratings.get(idx) for idx in movieEmbIds]

        inputs = [user_embedding_ids, userAvgRatings, movieEmbIds, movieAvgRatings, genreEmbeddings]
        predictions = self.model.predict(inputs, 2**10)

        return predictions.squeeze().sort(reverse=True)[0:numRatings]

    
    def predict_bulk(self, ids, numRatings):
        predictions = []
        for idx in ids:
            predictions.append(self.predict(idx, numRatings))
        return predictions
    
    def get_test_ndcg(self):
        ratings = self.ratings
        ids = self.test['userId'].drop_duplicates().take(500).values

        all_users_ndcg = 0.0
        for idx in ids:
            predictions = self.predict(idx, 10)
            user_ratings = ratings[ratings['userId'] == uid]['rating'].sort_values(ascending=False).take(10)
            all_users_ndcg += calculate_ndcg(user_ratings, predictions)

        print('ndcg', all_users_ndcg/len(ids))
        return all_users_ndcg/len(ids)
    
    def test_on_user(self, uid):
        ratings = self.ratings
        movies = self.movies

        user_ratings = ratings[ratings['userId'] == uid][['userId', 'movieId', 'rating', 'userEmbeddingId', 'movieEmbeddingId', 'genreEmbedding']]
        genreEmbeddings = np.array(list(map(lambda x: np.array(x), user_ratings['genreEmbedding'].values)))
        user_ratings['predictions'] = self.model.predict([user_ratings[['userEmbeddingId']], user_ratings[['movieEmbeddingId']], genreEmbeddings], 64)

        predictions_df = user_ratings.merge(self.movies, 
                            on='movieId', 
                            how='inner', 
                            suffixes=['_u', '_m']).sort_values(by='rating', ascending=False)
        print(predictions_df['predictions'].describe())
        print(predictions_df[['rating', 'predictions', 'title', 'genres']])


        user_embedding_id = user_ratings['userEmbeddingId'].drop_duplicates().values
        unrated = ratings[ratings['movieId'].isin(user_ratings['movieId']) == False].drop_duplicates(subset=['movieId'])
        genreEmbeddings = np.array(list(map(lambda x: np.array(x), unrated['genreEmbedding'].values)))
        unrated = unrated[['movieId', 'movieEmbeddingId']]

        user_embedding_ids = [user_embedding_id for _ in range(0,len(unrated))]
        unrated['predictions'] = self.model.predict([user_embedding_ids, unrated[['movieEmbeddingId']], genreEmbeddings], 2**10)

        unrated_predictions_df = unrated.merge(self.movies, 
                            on='movieId', 
                            how='inner', 
                            suffixes=['_u', '_m']).sort_values(by='predictions', ascending=False)
        print(unrated_predictions_df[['predictions', 'title', 'genres']])
        print(unrated_predictions_df['predictions'].describe())
        

    # def test_on_user(self, uid):
    #     np.set_printoptions(threshold=sys.maxsize)
    #     ratings = self.ratings
    #     movies = self.movies
    #     user_embedding = self.ratings[ratings['userId'] == uid]['userEmbeddingId'].drop_duplicates().values

    #     rated_ids = ratings[ratings['userId'] == uid]['movieId']
    #     rated_movies = ratings[ratings['userId'] == uid].drop_duplicates()
    #     rated_movies = movies.merge(rated_movies, on='movieId').sort_values('ratings', ascending=False)
    #     rated_movies = rated_movies[['userId','title', 'genres', 'ratings']]
    #     candidate_movies = ratings[~ratings['movieId'].isin(rated_ids)]['movieId'].drop_duplicates()
    #     candidate_movies = movies[movies['movieId'].isin(candidate_movies)]
    #     unrated_embeddings = ratings[~ratings['movieId'].isin(rated_ids)]['movieEmbeddingId'].drop_duplicates()

    #     
    #     inputs = [user_embeddings, unrated_embeddings]
    #     # print(user_embeddings)
    #     predictions = self.model.predict(inputs)
    #     candidate_movies['ratings'] = np.array(predictions).squeeze()

        # print(f'User rated: \n{rated_movies}')
        # print(f"Recommendations: \n{candidate_movies.sort_values('ratings', ascending=False)}")


