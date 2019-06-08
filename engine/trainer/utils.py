from tensorflow.python.lib.io import file_io
import pandas as pd
def load_data(input_path, mode='local'):
    if mode == 'local':
        from pathlib import Path

        return pd.read_csv(Path(input_path), delimiter=',', header=0)
    
    else:
        input_path = 'datasets/ml-latest-small/ratings.csv'
        with file_io.FileIO(Path(input_path), mode='r') as input_f:
            return pd.DataFrame(data=input_f.readlines())

def save_model(self, path, model, mode='local'):
    if mode == 'local': 
        from pathlib import Path

        save_h5_path = Path(path +'test_model.h5')
        save_json_path = Path(path + 'test_model.json')
        model.save(save_h5_path, overwrite=True)
        json_string = self.model.to_json()
        with open(save_json_path, 'w+') as f:
            f.write(json_string)
    else:
        from tensorflow.python.lib.io import file_io
        model.save('model.h5')
        with file_io.FileIO('model.h5', mode='r') as input_f:
            with file_io.FileIO(job_dir + '/model.h5', mode='w+') as output_f:
                output_f.write(input_f.read())

def load_a_model(self, path, model, mode):
    if mode == 'local':
        from pathlib import Path
        trained_model_path = Path(path + 'test_model.h5')
        structure_model_path = Path(path + 'test_model.json')
        # model = model_from_json(json_string)
        self.model = load_model(trained_model_path)

    else:
        pass