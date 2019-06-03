from NN import NN
import pandas as pd
import numpy as np
from pathlib import Path
import tensorflow as tf
from tensorflow.python.lib.io.file_io import FileIO
EPOCHS = 500
BATCH_SIZE = 32

def load_data(input_path):
    return pd.read_csv(input_path, delimiter=',', header=0)

def main(unused_argv):
    with tf.device('/device:GPU:0'):
        (train_file, mode='r')
        rating_path = Path('~/movie_recommandation/datasets/ml-latest-small/ratings.csv')
        data = load_data(rating_path)

        model = NN(data, batch_size=BATCH_SIZE)
        model.train_model(epochs=EPOCHS)

        model.test_model()
        model.save_model('/Users/tiberiusimionvoicu/movie_recommandation/engine/results/')
        

if __name__=='__main__':
    tf.app.run()

