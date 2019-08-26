import os
dirname = os.path.dirname(__file__)

import matplotlib.pyplot as plt
import numpy as np

PATH = os.path.join(dirname, '../train_history/2019-08-13 20:26:02.488617.csv')

# epochs, test_rmse, test_mae, train_rmse, test_mae
losses = np.loadtxt(PATH, delimiter=',', skiprows=1)
print(losses)

plt.plot(losses[:,3])
plt.plot(losses[:,1])
plt.title('Model RMSE')
plt.ylabel('RMSE')
plt.xlabel('epoch')
plt.legend(['train', 'test'], loc='upper left')
plt.show()

plt.plot(losses[:,4])
plt.plot(losses[:,2])
plt.title('Model MAE')
plt.ylabel('MAE')
plt.xlabel('epoch')
plt.legend(['train', 'test'], loc='upper left')
plt.show()