import "ts-node/register";

// eslint-disable-next-line no-undef
module.exports = {
  development: {
    client: "pg",
    connection: {
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
      extension: "ts",
    },
  },
  production: {
    client: "pg",
    connection: process.env.DB_URL,
    migrations: {
      tableName: "knex_migrations",
      directory: "./migrations",
      extension: "ts",
    },
  },
};
