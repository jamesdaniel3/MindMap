# TypeScript Koa PostgreSQL API

A RESTful API service built with TypeScript, Koa, and PostgreSQL, ready for deployment on Google Cloud Run.

## Project Structure

```
ts-koa-postgres-api/
├── src/
│   ├── config/        # Configuration files
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Custom middleware
│   ├── queries/       # Database queries
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   ├── db/            # Database migrations and seeds
│   ├── app.ts         # Main application setup
│   └── server.ts      # Server entry point
├── .env               # Environment variables (not versioned)
├── tsconfig.json      # TypeScript configuration
├── package.json       # Node.js dependencies
└── Dockerfile         # Docker configuration for Cloud Run
```

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL database (local or Cloud SQL)
- Google Cloud account (for deployment)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:

   ```
   cp .env.example .env
   ```

   Edit the `.env` file with your database credentials.

4. Start the development server:

   ```
   npm run dev
   ```

5. Test the health check endpoint:
   ```
   curl http://localhost:3000/health
   ```

## Database Migrations

This project uses Knex.js for database migrations:

```bash
# Create a new migration
npx knex migrate:make migration_name

# Run migrations
npx knex migrate:latest

# Rollback migrations
npx knex migrate:rollback
```

## Deployment to Google Cloud Run

1. Build and push the Docker image:

   ```
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ts-koa-postgres-api
   ```

2. Deploy to Cloud Run:
   ```
   gcloud run deploy ts-koa-postgres-api \
     --image gcr.io/YOUR_PROJECT_ID/ts-koa-postgres-api \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars NODE_ENV=production,DB_HOST=YOUR_DB_HOST,DB_PORT=5432,DB_NAME=YOUR_DB_NAME,DB_USER=YOUR_DB_USER,DB_PASSWORD=YOUR_DB_PASSWORD
   ```

For production deployment with Cloud SQL, use:

```
gcloud run deploy ts-koa-postgres-api \
  --image gcr.io/YOUR_PROJECT_ID/ts-koa-postgres-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,DB_NAME=YOUR_DB_NAME,DB_USER=YOUR_DB_USER,DB_PASSWORD=YOUR_DB_PASSWORD \
  --add-cloudsql-instances YOUR_PROJECT_ID:YOUR_REGION:YOUR_INSTANCE_NAME
```

## Health Check

The service includes a health check endpoint at `/health` that verifies the database connection.
