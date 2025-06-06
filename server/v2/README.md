# MindMap Backend

## Project Structure

```
server/
├── v1/
├── v2/
│   ├── config/               # Configuration files
│   ├── controllers/          # Route controllers
│   ├── db/                   # Database migrations and seeds
│   ├── interfaces/           # Interfaces
│   ├── middleware/           # Custom middleware
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── utils/                # Utility functions
│   ├── app.ts                # Main application setup
│   └── server.ts             # Server entry point
├── .env                      # Environment variables (not versioned)
├── tsconfig.json             # TypeScript configuration
├── package.json              # Node.js dependencies
└── Dockerfile                # Docker configuration for Cloud Run
└── Dockerfile.dev            # Docker configuration for Local Run
└── docker-compose.dev.yml    # Docker container launcher for Local Run
└── gcloud_deploy.sh          # Script for deploying new backend revisions to Cloud
└── knexfile.ts               # Knex database configuration
```

## Prerequisites

- Node.js (v18 or later)
- Google Cloud account (for deployment)

## Database

![Database Diagram](/server/v2/MindMapERD.png)

This project uses PostgreSQL for it's database. The hosted instance is on Google Cloud SQL and the development instance is created when the development docker file is composed.

Not shown in the diagram are the knex_migrations and knex_migrations_lock tables that are generated by knex to maintain the version history of the tables. Additionally, every table has a column labeled created_at and a column labeled updated_at to keep track of the age of the data. This will be useful if we ever need to do a rollback or edit data from a certain period of time.

This project uses database migrations to keep a version history of the database tables. This allows for a rollback of any changes that are made to tables. The migrations are implemented with Knex and can be found in `/db/migrations`.

Knex is also used to build the queries used for logic, and its documentation can be found [here](https://knexjs.org/).

To make a new migration:

```bash
npx knex migrate:make <migration_name>
```

Because of some difficulties I ran into with executing migrations and rollbacks in production, migrations and rollbacks are handled through the API. They can be found at `BASE_URL/api/v2/admin/migrate/ADMIN_API_KEY` and `BASE_URL/api/v2/admin/rollback/ADMIN_API_KEY` respectively.

The ADMIN_API_KEY value can be found in your env file and in the google cloud revision's environment variables.

### Viewing the Databases

The production instance of the database can be viewed through a GUI in Google Cloud SQL in the Cloud SQL Studio. I have not tried to set up a GUI for the docker instance, but it can accessed through the terminal with the following:

```bash
docker exec -it v2-postgres-1 bash   # assuming the name of your postgres instance is v2-postgres1
psql -U postgres -d postgres
```

## Running Backend Locally

To run the backend locally, start the docker app and run the following in terminal:

```bash
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up
```

The first time you open your docker instance, I recommend using Postman to first check your database connection and then run migrations:

1. `http://localhost:8080/api/v2/health/db`
2. `http://locahost:8080/api/v2/admin/migrate/ADMIN_API_KEY`

To close a docker instance:

```bash
docker-compose -f docker-compose.dev.yml down
```

To close a docker instance and remove volumes (this will delete your database history):

```bash
docker-compose -f docker-compose.dev.yml down -v
```

## Deployment to Google Cloud Run

Whenever new API endpoints are created or new migrations are added (basically after you finsih a PR in the backend), you need to update the revision in google cloud by using the `gcloud_deploy.sh` file.

This file relies on you having google cloud's cli tools set up, so you will need to navigate setting those up the first time you run it. Once those are set up, sending backend changes to production is as simple as

```bash
./gcloud_deploy.sh
```

There are two main pages used on Google Cloud Console at the time of this writing:

1. [Google Cloud Run](https://console.cloud.google.com/run?authuser=5&hl=en&inv=1&invt=AbthOg&project=mindmap-455320)
2. [Google Cloud SQL](https://console.cloud.google.com/sql/instances?authuser=5&hl=en&invt=Abth8Q&project=mindmap-455320)

If you are working on this project you should have access to both. I will soon migrate the Cloud Auth account to this project and will provide a link to that when I do.
