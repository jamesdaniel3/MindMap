#!/bin/bash

# Exit on any error
set -e

# Configuration variables - modify these for your project
PROJECT_ID="mindmap-455320"
SERVICE_NAME="mind-map-backend"
REGION="us-east4" 
DB_INSTANCE="prod-postgres"
DB_REGION="us-east4"  

# Make sure Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "Error: Docker is not running. Please start Docker desktop first."
  exit 1
fi

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
  echo "Error: gcloud CLI is not installed. Please install Google Cloud SDK first."
  exit 1
fi

# Make sure the script is executable
if [ ! -x "$0" ]; then
  echo "Making script executable..."
  chmod +x "$0"
fi

# Generate timestamp-based tag
TAG=$(date +%Y%m%d%H%M%S)
echo "Building with tag: $TAG"

# Build the Docker image
echo "Building Docker image..."
docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME:$TAG .

# Push to Google Container Registry
echo "Pushing to Container Registry..."
docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:$TAG

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
echo "Note: Using environment variables configured in Cloud Run GUI"

# Deploy without changing environment variables
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME:$TAG \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --add-cloudsql-instances=$PROJECT_ID:$DB_REGION:$DB_INSTANCE \

echo "Deployment completed successfully!"
echo "Deployed image: gcr.io/$PROJECT_ID/$SERVICE_NAME:$TAG"
echo "Service URL: $(gcloud run services describe $SERVICE_NAME --region $REGION --format='value(status.url)')"