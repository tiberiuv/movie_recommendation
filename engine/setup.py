from setuptools import find_packages, setup

setup(name='trainer',
      version='0.1',
      packages=find_packages(),
      description='v1-recommender',
      author='Tiberiu Voicu',
      author_email='tiberiusimionvoicu@gmail.com',
      license='MIT',
      install_requires=[
          'keras',
          'h5py'
      ],
      zip_safe=False)