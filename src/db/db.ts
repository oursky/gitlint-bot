import knex from "knex";
import knexfile from "./knexfile";

const env = process.env.NODE_ENV ?? "development";
const db = knex(knexfile[env]);

export default db;
