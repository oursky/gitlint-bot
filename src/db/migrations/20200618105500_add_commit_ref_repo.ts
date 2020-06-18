import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("commit", (builder) => {
    builder.text("repo_name").notNullable().defaultTo("");
    builder.text("ref").notNullable().defaultTo("");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("commit", (builder) => {
    builder.dropColumn("repo_name");
    builder.dropColumn("ref");
  });
}
