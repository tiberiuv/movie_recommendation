import os
import sys

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

import tensorflow as tf
# import tensorflow.keras as keras
from keras.models import Model
from keras.layers import Embedding, \
    Dense, Dot, Input, Reshape, \
    Dropout, Concatenate, Conv1D, \
    GlobalMaxPool1D, GlobalAveragePooling1D, \
    MaxPool1D, AveragePooling1D, BatchNormalization, \
    Flatten, LeakyReLU, Reshape
from keras.models import load_model, model_from_json
from keras.optimizers import Adam
from keras.metrics import mae
from keras import callbacks, regularizers
from keras.utils import to_categorical, multi_gpu_model
from keras.backend.tensorflow_backend import set_session
from generator import Generator
from sklearn import preprocessing
from keras import backend as K
import keras
from sklearn.preprocessing import MultiLabelBinarizer



def root_mean_squared_error(y_true, y_pred):
    return K.sqrt(K.mean(K.square(y_pred - y_true)))


class NN(object):

    def __init__(self, ratings, movies, batch_size=2**10, embedding_user=100, embedding_movies=100, embedding_genres=20):
        
        self.batch_size = batch_size
        self.embedding_user = embedding_user
        self.embedding_movies = embedding_movies
        self.embedding_genres = embedding_genres

        # counts = ratings['movieId'].value_counts()
        # ratings = ratings[ratings['movieId'].isin(counts[counts > 50].index)]
        # ratings.reset_index(drop=True, inplace=True)

        # scaler = preprocessing.MinMaxScaler(feature_range=(-1,1))
        # ratings['ratings'] = scaler.fit_transform(ratings['ratings'].values.reshape(-1, 1))

        self.n_users = ratings['userId'].drop_duplicates().size
        self.n_movies = ratings['movieId'].drop_duplicates().size

        genres = list(set([j for i in movies['genres'].values for j in i.split('|')]))
        self.n_genres = len(genres)
        # genresMap = {x:idx for idx,x in enumerate(genres)}
        # def make_multi_one_hot(genreStr):
        #     genres = genreStr.split('|')
        #     encoding = np.arange(0, self.n_genres)
        #     for g in genres:
        #         encoding[]

        # movies['genreEmbeddingId'] = movies['genres'].map(lambda x: list(map(lambda y: genresMap[y], x.split('|'))))
        # ratings['genreEmbeddingId'] = movies.merge(ratings, on='movieId')[['genreEmbeddingId']]
        # genres = movies['genres'].map(lambda x: x.split('|'))
        one_hot = MultiLabelBinarizer()
        # print([tuple(x) for x in one_hot.fit_transform(movies['genres'].map(lambda x: x.split('|'))).tolist()])
        movies['genreEmbedding'] = [tuple(x) for x in one_hot.fit_transform(movies['genres'].map(lambda x: x.split('|'))).tolist()]
        ratings['genreEmbedding'] = movies.merge(ratings, on='movieId')[['genreEmbedding']]

        usersMap = {x:idx for idx,x in enumerate(ratings['userId'].drop_duplicates().values.tolist())}
        moviesMap = {x:idx for idx,x in enumerate(ratings['movieId'].drop_duplicates().values.tolist())}
        ratings['userEmbeddingId'] = ratings['userId'].map(usersMap).fillna(ratings['userId'])
        ratings['movieEmbeddingId'] = ratings['movieId'].map(moviesMap).fillna(ratings['movieId'])
        
        # min_max_scaler = preprocessing.MinMaxScaler()
        # print(ratings['ratings'].describe())
        # ratings['ratings'] = min_max_scaler.fit_transform(ratings['ratings'].values.reshape((-1,1)))
        # print(ratings['ratings'].describe())
        shuffled_ratings = ratings.sample(frac=1., random_state=24)

        self.ratings = shuffled_ratings
        self.train, self.test = train_test_split(shuffled_ratings, test_size=0.1)
        # self.train.reset_index(drop=True, inplace=True)
        # self.test.reset_index(drop=True, inplace=True)

        self.movies = movies

        self.build_model()

    def build_model(self):
        user = Input(name='user', shape=[1])
        movie = Input(name='movie', shape=[1])
        genres = Input(name='genre', shape=[self.n_genres])
        user_embedding = Embedding(
            name='user_embedding',
            input_dim=self.n_users+1,
            output_dim=self.embedding_user,
            input_length=1
        )(user)
        user_embedding = Dropout(0.2)(user_embedding)
        
        movies_embedding = Embedding(
            name='movies_embedding',
            input_dim=self.n_movies+1,
            output_dim=self.embedding_movies,
            input_length=1
        )(movie)
        movies_embedding = Dropout(0.2)(movies_embedding)

        # genre_embedding = Embedding(
        #     name='genre_embedding',
        #     input_dim=self.n_genres+1,
        #     output_dim=self.embedding_genres
        # )(genres)
        # genre_embedding = keras.layers.Lambda(lambda x: K.mean(x, axis=1, keepdims=True))(genre_embedding)
        genre_embedding = Dense(self.embedding_genres, name='genre_embedding')(genres)
        genre_embedding = LeakyReLU()(genre_embedding)
        genre_embedding = Dropout(0.2)(genre_embedding)
        print(genre_embedding.shape)
        genre_embedding = Reshape((1, self.n_genres))(genre_embedding)
        print(movies_embedding.shape)
        print(genre_embedding.shape)

        merged_embedding = Flatten()(Concatenate(axis=2)([user_embedding, movies_embedding, genre_embedding]))

        dense_1 = Dense(2048)(merged_embedding)
        dense_1 = LeakyReLU()(dense_1)
        dense_1 = Dropout(0.3)(dense_1)

        dense_2 = Dense(2048)(dense_1)
        dense_2 = LeakyReLU()(dense_2)
        dense_2 = Dropout(0.3)(dense_2)

        dense_3 = Dense(1024)(dense_2)
        dense_3 = LeakyReLU()(dense_3)
        dense_3 = Dropout(0.3)(dense_3)

        dense_4 = Dense(1024)(dense_3)
        dense_4 = LeakyReLU()(dense_4)
        dense_4 = Dropout(0.3)(dense_4)

        dense_5 = Dense(512)(dense_4)
        dense_5 = LeakyReLU()(dense_5)
        dense_5 = Dropout(0.3)(dense_5)

        dense_6 = Dense(256)(dense_5)
        dense_6 = LeakyReLU()(dense_6)
        dense_6 = Dropout(0.3)(dense_6)

        dense_7 = Dense(128)(dense_6)
        dense_7 = LeakyReLU()(dense_7)
        dense_7 = Dropout(0.3)(dense_7)

        out = Dense(1)(dense_7)

        # merged_embedding = Concatenate(axis=2)([user_embedding, movies_embedding])

        # conv_1 = Conv1D(input_shape=(None,300),
        #                 filters=256, 
        #                 kernel_size=3,
        #                 activation='relu',
        #                 padding='same',
        #                 use_bias=False,
        #                 strides=1)(merged_embedding)
        # batch_norm_1 = BatchNormalization()(conv_1)
        # max_pool_1 = MaxPool1D(pool_size=1, strides=5)(batch_norm_1)
        # # max_pool_1 = Dropout(0.25)(max_pool_1)

        # conv_2 = Conv1D(
        #                 filters=512,
        #                 kernel_size=5,
        #                 activation='relu',
        #                 padding='same',
        #                 use_bias=False,
        #                 strides=1)(max_pool_1)
        # batch_norm_2 = BatchNormalization()(conv_2)
        # max_pool_2 = MaxPool1D(pool_size=1, strides=5)(batch_norm_2)
        # # max_pool_2 = Dropout(0.25)(max_pool_2)

        # conv_3 = Conv1D(
        #                 filters=1024,
        #                 kernel_size=5,
        #                 activation='relu',
        #                 padding='same',
        #                 use_bias=False,
        #                 strides=1)(max_pool_2)
        # batch_norm_3 = BatchNormalization()(conv_3)
        # max_pool_3 = MaxPool1D(pool_size=1, strides=5)(batch_norm_3)
        # # max_pool_3 = Dropout(0.25)(max_pool_3)

        # conv_4 = Conv1D(
        #                 filters=512,
        #                 kernel_size=5,
        #                 activation='relu',
        #                 padding='same',
        #                 use_bias=False,
        #                 strides=1)(max_pool_3)
        # batch_norm_4 = BatchNormalization()(conv_4)
        # max_pool_4 = MaxPool1D(pool_size=1, strides=5)(batch_norm_4)
        # # max_pool_4 = Dropout(0.25)(max_pool_4)

        # conv_5 = Conv1D(
        #                 filters=256,
        #                 kernel_size=3,
        #                 activation='relu',
        #                 padding='same',
        #                 use_bias=False,
        #                 strides=1)(max_pool_4)
        # batch_norm_5 = BatchNormalization()(conv_5)
        # max_pool_5 = MaxPool1D(pool_size=1, strides=5)(batch_norm_5)
        # # max_pool_5 = Dropout(0.25)(max_pool_5)

        # global_average_pool_1 = GlobalAveragePooling1D()(max_pool_5)

        # # Output neuron
        # out = Dense(1)(global_average_pool_1)

        config = tf.ConfigProto()
        config.gpu_options.allow_growth = True
        set_session(tf.Session(config=config))

        gpus = os.environ.get('CUDA_VISIBLE_DEVICES', '').split(',')
        self.model = Model(inputs = [user, movie, genres], outputs = out)
        print(self.model.summary())

        adam = Adam(lr=0.0002, clipnorm=1.0, clipvalue=0.5) 
        # lr 0.00002
        if(len(gpus) > 1 ):
            with tf.device("/cpu:0"):
                self.s_model = Model(inputs = [user, movie, genres], outputs = out)
                self.model = multi_gpu_model(self.s_model, gpus=len(gpus))
                self.batch_size = self.batch_size * len(gpus)
                self.s_model.compile(optimizer='adam', loss='mse', metrics=['mae'])
        # Minimize mse
        self.model.compile(optimizer=adam, loss=root_mean_squared_error, metrics=['mae'])

    def train_model(self, epochs=100):
        print('# Fit model on training data')

        _callbacks = [
            callbacks.TensorBoard(log_dir='./Graph', histogram_freq=0, write_graph=True, write_images=True),
            callbacks.EarlyStopping('val_loss', patience=2),
        ] 

        train_gen = Generator(self.train, self.batch_size)
        validate_gen = Generator(self.test, self.batch_size)

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

        try:
            self.s_model.save_weights('model.h5')
        except err:
            print('Error saving: ',err)
            self.model.save_weights('model.h5')
        


    def test_model(self):
        # Evaluate the model on the test data using `evaluate`
        print('\n# Evaluate on test data')

        test_gen = self.batch_generator(self.test, batch_size=self.batch_size)

        results = self.model.evaluate_generator(test_gen, steps=(len(self.test) // self.batch_size))
        print('test loss, test acc:', results)
    
    def load_model(self, path):
        self.model.load_weights(path)
    
    def predict(self, uid, numRatings):
        ratings = self.ratings
        movies = self.movies
        user_embedding_id = ratings[ratings['userId'] == uid]['userEmbeddingId'].drop_duplicates().values
        cadidates = ratings[~ratings['movieId'].isin(ratings['userId'] == uid)][['movieEmbeddingId']].drop_duplicates()
        user_embedding_ids = [user_embedding for _ in range(0,len(cadidates))]

        inputs = [user_embedding_ids, cadidates]
        predictions = self.model.predict(inputs, 2**10)

        return predictions.squeeze()
    
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


