from keras.models import Model
from keras.layers import Embedding, \
    Dense, Dot, Input, Reshape, \
    Dropout, Concatenate, Conv1D, \
    GlobalMaxPool1D, GlobalAveragePooling1D, \
    MaxPool1D, AveragePooling1D, BatchNormalization, Flatten
from keras.models import load_model, model_from_json
from keras.metrics import mae
from keras import callbacks
from keras.utils import to_categorical
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
import sys


class NN(object):

    def __init__(self, rating, movie, batch_size=128, embedding_user=20, embedding_movie=20, genre_embedding_size=5):
        
        self.batch_size = batch_size
        self.embedding_user = embedding_user
        self.embedding_movie = embedding_movie
        self.genre_embedding_size = genre_embedding_size

        counts = rating['movieId'].value_counts()
        rating = rating[rating['movieId'].isin(counts[counts > 50].index)]

        self.n_users = rating['userId'].drop_duplicates().size
        self.n_movies = rating['movieId'].drop_duplicates().size
        print(f'Users {self.n_users}')
        print(f'Movies {self.n_movies}')
        
        # rating['userEmbeddingId'] = rating['userId'] - 1
        # rating['movieEmbeddingId'] = rating['movieId'] - 1
        usersMap = {x:idx for idx,x in enumerate(rating['userId'].drop_duplicates().values.tolist())}
        moviesMap = {x:idx for idx,x in enumerate(rating['movieId'].drop_duplicates().values.tolist())}
        # print(moviesMap)
        rating['userEmbeddingId'] = rating['userId'].map(usersMap).fillna(rating['userId'])
        rating['movieEmbeddingId'] = rating['movieId'].map(moviesMap).fillna(rating['movieId'])
        # print(rating)
        # print(rating['userEmbeddingId'])
        shuffled_ratings = rating.sample(frac=1., random_state=135151)

        self.rating = shuffled_ratings
        self.train, self.test = train_test_split(shuffled_ratings, test_size=0.1)
        # self.user = shuffled_ratings['userEmbeddingId'].values
        self.movie = movie

        self.build_model()

    def batch_generator(self, train, batch_size=16):
        '''
        Return a random sample from X, y
        '''
        while True:
            batch = train.sample(batch_size)

            userId = batch.loc[:]['userEmbeddingId']
            movieId = batch.loc[:]['movieEmbeddingId']
            ratings = batch.loc[:]['rating']

            yield [np.array(userId), np.array(movieId)], ratings

    def build_model(self):
        user = Input(name='user', shape=[1])
        movie = Input(name='movie', shape=[1])
        # genre = Input(name='genre', shape=[1], batch_size=self.batch_size)
        user_embedding = Embedding(
            name='user_embedding',
            input_dim=self.n_users+1,
            output_dim=self.embedding_user,
            input_length=1
        )(user)
        
        movie_embedding = Embedding(
            name='movie_embedding',
            input_dim=self.n_movies+1,
            output_dim=self.embedding_movie,
            input_length=1
        )(movie)

        # movie_embedding = Dropout(0.2)(movie_embedding)
        # genre_embedding = Embedding(
        #     name='genre_embedding',
        #     input_dim=genreids,
        #     output_dim=self.genre_embedding_size
        # )(genre)
        # genre_embedding = Dropout(0.2)(genre_embedding)

        merged_embedding = Concatenate(axis=2)([user_embedding, movie_embedding])
        # merged_embedding = Concatenate(axis=2)[user_embedding, movie_embedding, genre_embedding]
        conv_1 =Conv1D(
                            filters=32, 
                            kernel_size=2,
                            activation='relu',
                            padding='same',
                            use_bias=False,
                            strides=1)(merged_embedding)
        batch_norm_1 = BatchNormalization()(conv_1)
        max_pool_1 =  Dropout(0.4)(MaxPool1D(pool_size=1, strides=5)(batch_norm_1))
        conv_2 = Conv1D(
                            filters=16,
                            kernel_size=2,
                            activation='relu',
                            padding='same',
                            use_bias=False,
                            strides=1)(max_pool_1)
        batch_norm_2 = BatchNormalization()(conv_2)
        max_pool_2 = Dropout(0.4)(MaxPool1D(pool_size=1, strides=5)(batch_norm_2))
        conv_3 = Conv1D(
                            filters=16,
                            kernel_size=2,
                            activation='relu',
                            padding='same',
                            use_bias=False,
                            strides=1)(max_pool_2)
        batch_norm_3 = BatchNormalization()(conv_3)
        average_pool_1 = Dropout(0.4)(AveragePooling1D(pool_size=1, strides=10)(batch_norm_3))
        dense_1 = Flatten()(average_pool_1)
        # global_average_pool_1 = GlobalAveragePooling1D()(average_pool_1)
        # fc_1 = Dropout(0.2)(Dense(128, activation='relu', use_bias=True)(global_average_pool_1))
        # fc_1 = Dropout(0.2)(Dense(256, activation='relu', use_bias=True)(merged_embedding))
        # fc_2 = Dropout(0.2)(Dense(128, activation='relu', use_bias=True)(merged_embedding))
        # fc_3 = Dropout(0.2)(Dense(64, activation='relu', use_bias=True)(fc_2))
        # fc_4 = Dropout(0.2)(Dense(32, activation='relu', use_bias=True)(fc_3))
        # Output neuron
        
        # out = Dense(1, activation = 'relu', use_bias=True)(fc_4)
        out = Dense(1, activation = 'relu', use_bias=True)(dense_1)

        self.model = Model(inputs = [user, movie], outputs = out)
        print(self.model.summary())
        # Minimize binary cross entropy
        self.model.compile(optimizer='Adam', loss='mse')

    
    def train_model(self, epochs=100):
        print('# Fit model on training data')
        _callbacks = [
            callbacks.TensorBoard(log_dir='./Graph', histogram_freq=0, write_graph=True, write_images=True),
            callbacks.EarlyStopping('loss', patience=10),
            callbacks.ModelCheckpoint('weights.h5', save_best_only=True),
        ] 

        train_gen = self.batch_generator(self.train, batch_size=self.batch_size)

        history = self.model.fit_generator(generator=train_gen, steps_per_epoch=(
            len(self.train.rating) / self.batch_size), epochs=epochs, callbacks=_callbacks)
        print('\nhistory dict:', history.history)

    def test_model(self):
        # Evaluate the model on the test data using `evaluate`
        print('\n# Evaluate on test data')

        test_gen = self.batch_generator(self.test, batch_size=self.batch_size)

        results = self.model.evaluate_generator(test_gen, steps=(len(self.test) / self.batch_size))
        print('test loss, test acc:', results)
    
    def test_on_user(self, uid):
        np.set_printoptions(threshold=sys.maxsize)
        rating = self.rating
        movie = self.movie
        user_embedding = self.rating[rating['userId'] == uid]['userEmbeddingId'].drop_duplicates().values

        rated_ids = rating[rating['userId'] == uid]['movieId']
        rated_movies = rating[rating['userId'] == uid].drop_duplicates()
        rated_movies = movie.merge(rated_movies, on='movieId').sort_values('rating', ascending=False)
        rated_movies = rated_movies[['userId','title', 'genres', 'rating']]
        candidate_movies = rating[~rating['movieId'].isin(rated_ids)]['movieId'].drop_duplicates()
        candidate_movies = movie[movie['movieId'].isin(candidate_movies)]
        unrated_embeddings = rating[~rating['movieId'].isin(rated_ids)]['movieEmbeddingId'].drop_duplicates()

        user_embeddings = [user_embedding for _ in range(0,len(unrated_embeddings))]
        inputs = [user_embeddings, unrated_embeddings]
        # print(user_embeddings)
        predictions = self.model.predict(inputs)
        candidate_movies['rating'] = np.array(predictions).squeeze()

        print(f'User rated: \n{rated_movies}')
        print(f"Recommendations: \n{candidate_movies.sort_values('rating', ascending=False)}")


