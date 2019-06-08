from NN import NN
import pandas as pd
import tensorflow as tf
from tensorflow.python.lib.io import file_io
import argparse
from utils import load_data, save_model

EPOCHS = 50
BATCH_SIZE = 32

LOCAL_RATING_PATH = '~/movie_recommandation/datasets/ml-latest-small/ratings.csv'

# def main(unused_argv):
def main(job_dir, **args):
	MODE = 'local'
	logs_path = job_dir + '/logs/'

	with tf.device('/device:GPU:0'):
		# with FileIO(train_file, mode='r'):
		if(args.get('cluster')):
			MODE = 'cluster'

		rating_data = load_data(LOCAL_RATING_PATH, MODE)

		model = NN(rating_data, batch_size=BATCH_SIZE)
		model.train_model(epochs=EPOCHS)

		model.test_model()
		save_model('results/', model, MODE=MODE)
        

if __name__=='__main__':
	parser = argparse.ArgumentParser()

	# Input Arguments
	parser.add_argument(
		'--job-dir',
		help='GCS location to write checkpoints and export models',
		required=True
    )
	args = parser.parse_args()
	arguments = args.__dict__

	main(**arguments)    


