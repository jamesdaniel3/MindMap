import dotenv from "dotenv";
import knex from "knex";

dotenv.config();

const dbConfig = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
    direction: "../db/migrations",
  },
  seeds: {
    directory: "../db/seeds",
  },
};

// production config
if (
  process.env.NODE_ENV === "production" &&
  process.env.INSTANCE_CONNECTION_NAME
) {
  const dbConfig = {
    client: "pg",
    connection: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      host: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
      direction: "../db/migrations",
    },
    seeds: {
      directory: "../db/seeds",
    },
  };
}

const db = knex(dbConfig);

export default db;
