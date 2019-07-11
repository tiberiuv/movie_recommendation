from tensorflow.python.lib.io.file_io import FileIO
import pandas as pd

def load_data(input_path, mode='local'):
        with FileIO(input_path, mode='r') as input_f:
            return pd.read_csv(input_f)

def save_model(path, model, mode='local'):
    if mode == 'local': 
        from pathlib import Path

        save_h5_path = Path(path +'test_model.h5')
        save_json_path = Path(path + 'test_model.json')
        model.save(save_h5_path, overwrite=True)
        json_string = model.to_json()
        with open(save_json_path, 'w+') as f:
            f.write(json_string)
    else:
        model.save('model.h5')
        with FileIO('model.h5', mode='r') as input_f:
            with FileIO(job_dir + '/model.h5', mode='w+') as output_f:
                output_f.write(input_f.read())

def load_a_model(path, model, mode):
    if mode == 'local':
        from pathlib import Path
        trained_model_path = Path(path + 'test_model.h5')
        structure_model_path = Path(path + 'test_model.json')
        # model = model_from_json(json_string)
        load_model(trained_model_path)

    else:
        pass