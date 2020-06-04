import * as Knex from "knex";

const tableName = "commit_result";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(tableName, (builder: Knex.TableBuilder) => {
    builder.increments("id").primary();
    builder.integer("commit_id").unsigned().notNullable();
    builder.string("rule").notNullable();
    builder.text("message").notNullable();
    builder.foreign("commit_id").references("id").inTable("commit");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}
