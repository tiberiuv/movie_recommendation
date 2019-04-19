#!/bin/bash
set -e

if [ "$1" != "" ]; then
    dir=$1
else
    dir="datasets"
fi

mkdir $dir

curl -o $dir/ml-latest.zip http://files.grouplens.org/datasets/movielens/ml-latest.zip
curl -o $dir/ml-small.zip http://files.grouplens.org/datasets/movielens/ml-small.zip
curl -o $dir/ml-20m.zip http://files.grouplens.org/datasets/movielens/ml-20m.zip

ECHO Downloaded files sucessfuly
