import dotenv from "dotenv";
import type { Knex } from "knex";

dotenv.config();

let dbConfig: Knex.Config = {
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
    directory: "../db/migrations",
  },
  seeds: {
    directory: "../db/seeds",
  },
};

if (
  process.env.NODE_ENV === "production" &&
  process.env.INSTANCE_CONNECTION_NAME
) {
  dbConfig = {
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
      directory: "../db/migrations",
    },
    seeds: {
      directory: "../db/seeds",
    },
  };
}

export default dbConfig; // Export the config, not the db instance
