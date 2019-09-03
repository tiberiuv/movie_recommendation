import os
dirname = os.path.dirname(__file__)

from flask import Flask
from .config import config_by_name
from trainer.utils import load_data
from trainer.NN import NN
import tensorflow as tf

def initModel():
    RATING_PATH = os.path.join(dirname, '../../datasets/ml-20m/ratings.csv')
    MOVIE_PATH = os.path.join(dirname, '../../datasets/ml-20m/movies.csv')
    BATCH_SIZE = 2**9

    rating_data = load_data(RATING_PATH)
    movie_data = load_data(MOVIE_PATH)
    model = NN(rating_data, movie_data, batch_size=BATCH_SIZE)
    model.load_model(os.path.join(dirname, '../model.h5'))
    return model

model = initModel()

def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    return app