from tensorflow.python.keras import Model, estimator
from tensorflow.python.keras.layers import Embedding, \
    Dense, Dot, Input, Reshape, \
    Dropout, Concatenate, Conv1D, \
    GlobalMaxPool1D, GlobalAveragePooling1D, \
    MaxPool1D, AveragePooling1D
from tensorflow.python.keras.models import load_model, model_from_json
from tensorflow.python.keras import metrics
from tensorflow.python.keras import callbacks
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split


class NN(object):

    def __init__(self, ratings, batch_size=32, embedding_size=20, genre_embedding_size=5):
        
        self.batch_size = batch_size
        self.embedding_size = embedding_size
        self.genre_embedding_size=20

        self.n_users = ratings['userId'].nunique()
        self.n_movies = ratings['movieId'].nunique()
        # self.users = ratings.userId.astype('category').cat.codes.values
        # self.movies = ratings.movieId.astype('category').cat.codes.values
        # self.n_genres = 

        self.train, self.test = train_test_split(ratings, test_size=0.1)
        self.users = self.train.userId.astype('category').cat.codes.values
        self.movies = self.train.movieId.astype('category').cat.codes.values
        self.users_test = self.test.userId.astype('category').cat.codes.values
        self.movies_test = self.test.movieId.astype('category').cat.codes.values
        self.build_model()

    def build_model(self):
        user = Input(name='users', shape=[1])
        movie = Input(name='movie', shape=[1])
        # genre = Input(name='genre', shape=[1], batch_size=self.batch_size)
        user_embedding = Embedding(
            name='user_embedding',
            input_dim=self.n_users+1,
            output_dim=self.embedding_size
        )(user)
        movie_embedding = Embedding(
            name='movie_embedding',
            input_dim=self.n_movies+1,
            output_dim=self.embedding_size
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
        conv_1 = Dropout(0.2)(Conv1D(
                            filters=64, 
                            kernel_size=2,
                            activation='relu',
                            padding='same',
                            strides=1)(merged_embedding))
        max_pool_1 = MaxPool1D(pool_size=1, strides=5)(conv_1)
        conv_2 = Dropout(0.2)(Conv1D(
                            filters=128,
                            kernel_size=2,
                            activation='relu',
                            padding='same',
                            strides=1)(max_pool_1))
        max_pool_2 = MaxPool1D(pool_size=1, strides=5)(conv_2)
        conv_3 = Dropout(0.2)(Conv1D(
                            filters=256,
                            kernel_size=5,
                            activation='relu',
                            padding='same',
                            strides=1)(max_pool_2))
        average_pool_1 = AveragePooling1D(pool_size=1, strides=10)(conv_3)
        global_average_pool_1 = GlobalAveragePooling1D()(average_pool_1)
        # fc_1 = Dropout(0.2)(Dense(128, activation='relu', use_bias=True)(global_average_pool_1))
        # fc_1 = Dropout(0.2)(Dense(256, activation='relu', use_bias=True)(merged_embedding))
        # fc_2 = Dropout(0.2)(Dense(128, activation='relu', use_bias=True)(merged_embedding))
        # fc_3 = Dropout(0.2)(Dense(64, activation='relu', use_bias=True)(fc_2))
        # fc_4 = Dropout(0.2)(Dense(32, activation='relu', use_bias=True)(fc_3))
        # Output neuron
        
        # out = Dense(1, activation = 'relu', use_bias=True)(fc_4)
        out = Dense(1, activation = 'relu', use_bias=True)(global_average_pool_1)

        self.model = Model(inputs = [user, movie], outputs = out)
        print(self.model.summary())
        # Minimize binary cross entropy
        self.model.compile(optimizer='Adam', loss='mean_absolute_error', metrics=[metrics.mae])

    
    def train_model(self, epochs=100):
        print('# Fit model on training data')
        tensorboard = callbacks.TensorBoard(log_dir='./Graph', histogram_freq=0, write_graph=True, write_images=True)
        history = self.model.fit(x=[self.users, self.movies], y=self.train.rating, batch_size=self.batch_size, epochs=epochs, callbacks=[tensorboard])
        print('\nhistory dict:', history.history)

    def test_model(self):
        # Evaluate the model on the test data using `evaluate`
        print('\n# Evaluate on test data')
        results = self.model.evaluate(x=[self.users_test, self.movies_test], y=self.test.rating, batch_size=128)
        print('test loss, test acc:', results)

