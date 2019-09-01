#!/bin/bash
set -e
url='http://files.grouplens.org/datasets/movielens'
if [ "$1" != "" ]; then
    dir=$1
else
    dir="datasets"
fi

mkdir $dir

curl -o $dir/ml-20m.zip $url/ml-20m.zip & unzip $dir/ml-20m.zip
curl -o $dir/ml-latest.zip $url/ml-latest.zip | unzip $dir/ml-latest.zip
curl -o $dir/ml-small.zip $url/ml-small.zip | unzip $dir/ml-small.zip
curl -o $dir/ml-1m.zip $url/ml-1m.zip | unzip $dir/ml-1m.zip

ECHO Downloaded files sucessfuly
