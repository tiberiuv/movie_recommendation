import numpy as np
from keras.utils import Sequence

class Generator(Sequence):
    def __init__(self, data, user_avg_ratings, movie_avg_ratings, batch_size):
        self.data = data
        self.user_avg_ratings = user_avg_ratings
        self.movie_avg_ratings = movie_avg_ratings
        self.batch_size = batch_size

    def __len__(self):
        return int(np.floor(len(self.data) / float(self.batch_size)))

    def __getitem__(self, idx):
        batch = self.data.take(np.arange(idx * self.batch_size, (idx + 1) * self.batch_size, 1), 0)
        userIds = batch.loc[:]['userEmbeddingId'].values
        movieIds = batch.loc[:]['movieEmbeddingId'].values
        genreEmbeddings = np.array(list(map(lambda x: np.array(x), batch.loc[:]['genreEmbedding'].values)))
        ratings = batch.loc[:]['rating'].values

        userAvgRatings = np.array([self.user_avg_ratings.get(i) for i in userIds.tolist()])
        movieAvgRatings = np.array([self.movie_avg_ratings.get(i) for i in movieIds.tolist()])

        # return [[userIds, movieIds, genreEmbeddings], ratings]
        return [[userIds, userAvgRatings, movieIds, movieAvgRatings, genreEmbeddings], ratings]
