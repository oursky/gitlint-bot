import * as Knex from "knex";

const tableName = "commit_diagnosis";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(tableName, (builder: Knex.TableBuilder) => {
    builder.increments("id").primary();
    builder.text("commit_id").notNullable();
    builder.text("rule").notNullable();
    builder.jsonb("data");
    builder.foreign("commit_id").references("id").inTable("commit");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}
