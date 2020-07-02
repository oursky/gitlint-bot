import knex from "knex";

type KnexConfigs = Record<string, knex.Config>;

const config = {
  development: {
    client: "pg",
    connection: {
      host: "db",
      database: "gitlint-bot",
      user: "user",
      password: "password",
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
      extension: "ts",
    },
  },
  test: {
    client: "pg",
    connection: {
      host: "db",
      database: "gitlint-bot",
      user: "user",
      password: "password",
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
      extension: "ts",
    },
  },
  staging: {
    client: "pg",
    connection: process.env.DB_URL,
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
      extension: "js",
    },
  },
  production: {
    client: "pg",
    connection: process.env.DB_URL,
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
      extension: "js",
    },
  },
} as KnexConfigs;

export = config;
