from NN import NN
import pandas as pd
import tensorflow as tf
from tensorflow.python.lib.io import file_io
import argparse
from utils import load_data, save_model
from visualize import plot_movie_rating_frequency

EPOCHS = 500
BATCH_SIZE = 64

LOCAL_RATING_PATH = '/users/tiberiusimionvoicu/movie_recommandation/datasets/ml-latest-small/ratings.csv'
LOCAL_MOVIE_PATH = '/users/tiberiusimionvoicu/movie_recommandation/datasets/ml-latest-small/movies.csv'
GCP_RATING_PATH = 'gs://train_ml_jobs/datasets/ml-latest-small/ratings.csv'
GCP_MOVIE_PATH = 'gs://train_ml_jobs/datasets/ml-latest-small/movies.csv'
# def main(unused_argv):
def main(job_dir, **args):
	MODE = 'local'
	RATING_PATH = LOCAL_RATING_PATH
	MOVIE_PATH = LOCAL_MOVIE_PATH
	if job_dir:
		logs_path = job_dir + '/logs/'
	else:
		logs_path = 'logs/'

	if(args.get('cluster')):
			MODE = 'cluster'
			RATING_PATH = GCP_RATING_PATH
			MOVIE_PATH = GCP_MOVIE_PATH
	# with tf.device('/gpu:0'):
		# sess = tf.Session(config=tf.ConfigProto(log_device_placement=True))

	rating_data = load_data(RATING_PATH)
	movie_data = load_data(MOVIE_PATH)

	# plot_movie_rating_frequency(rating_data)
	model = NN(rating_data, movie_data, batch_size=BATCH_SIZE)
	model.train_model(epochs=EPOCHS)

	model.test_model()
	model.test_on_user(321)
	# save_model('results/', model, mode=MODE)
        

if __name__=='__main__':
	parser = argparse.ArgumentParser()

	# Input Arguments
	parser.add_argument(
		'--job-dir',
		help='GCS location to write checkpoints and export models',
		required=False
    )
	parser.add_argument(
		'--cluster',
		help='Whether to run local or on cloud',
		required=False
    )
	args = parser.parse_args()
	arguments = args.__dict__

	main(**arguments)    


