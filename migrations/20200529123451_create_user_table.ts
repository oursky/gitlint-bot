import * as Knex from "knex";

const userTableName = "user";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(userTableName, (builder) => {
    builder.increments("id").primary();
    builder.string("name").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(userTableName);
}
