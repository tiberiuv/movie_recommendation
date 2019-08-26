import os
dirname = os.path.dirname(__file__)

import pandas as pd
import numpy as np
from surprise import BaselineOnly, Dataset, Reader, NMF, SVD, evaluate
from surprise.model_selection import cross_validate, KFold

LOCAL_RATING_PATH = os.path.join(dirname, '../../datasets/ml-20m/ratings.csv')

reader = Reader(line_format='user item rating timestamp', sep=',', skip_lines=1)

data = Dataset.load_from_file(LOCAL_RATING_PATH, reader=reader)

model_nmf = NMF(100, 100, verbose=True, biased=True, reg_pu=1, reg_qi=1)
model_svd = SVD(100, 100, verbose=True, reg_all=0.05, lr_pu=0.001, lr_qi=0.001)
models = [model_nmf, model_svd]

folds = KFold(n_splits=3, random_state=5)

for model in models:
    results = cross_validate(model, data, cv=folds, verbose=True)
    print(results)
    history = [results['test_rmse'], results['test_mae']]
    pd.DataFrame(results).to_csv(f'{model.__class__.__name__}_history.csv')

