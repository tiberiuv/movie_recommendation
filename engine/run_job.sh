gcloud ai-platform jobs submit training JOB4 --module-name=trainer.main --package-path=./trainer  --job-dir=gs://mljobs --region=europe-west1 --config=trainer/cloudml-gpu.yaml
