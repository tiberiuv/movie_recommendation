#!/bin/bash
set -e

gcloud ai-platform jobs submit training $1 --module-name=trainer.main --package-path=./trainer  --job-dir=gs://train_ml_jobs/ --region=europe-west1 --config=trainer/cloudml-gpu.yaml -- --cluster 1

ECHO 'Streaming logs for '$1
gcloud ai-platform jobs stream-logs $1
