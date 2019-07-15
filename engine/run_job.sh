#!/bin/bash
set -e

job_dir="gs://train_ml_jobs/"
region="us-west1"
module_name="trainer.main"
package_path="./trainer"
config_path="trainer/cloudml-gpu.yaml"
python_version="3.5"

gcloud ai-platform jobs submit training $1 --module-name=$module_name --package-path=$package_path --python-version=$python_version  --job-dir=$job_dir  --region=$region --config=trainer/cloudml-gpu.yaml -- --cluster 1

ECHO 'Streaming logs for '$1
gcloud ai-platform jobs stream-logs $1
