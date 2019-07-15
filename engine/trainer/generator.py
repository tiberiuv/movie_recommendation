import numpy as np
from keras.utils import Sequence

class Generator(Sequence):
    def __init__(self, data, batch_size):
        self.data = data
        self.batch_size = batch_size

    def __len__(self):
        return int(np.floor(len(self.data) / float(self.batch_size)))

    def __getitem__(self, idx):
        batch = self.data.take(np.arange(idx * self.batch_size, (idx + 1) * self.batch_size, 1), 0)
        userIds = batch.loc[:]['userEmbeddingId'].values
        movieIds = batch.loc[:]['movieEmbeddingId'].values
        genreEmbeddings = np.array(list(map(lambda x: np.array(x), batch.loc[:]['genreEmbedding'].values)))
        ratings = batch.loc[:]['rating'].values
        # print(userIds.shape, movieIds.shape, genreEmbeddings.shape)
        # print(genreEmbeddings)
        # print([userIds, movieIds, genreEmbeddings])

        return [[userIds, movieIds, genreEmbeddings], ratings]
