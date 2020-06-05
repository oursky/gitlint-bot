import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("commit", (builder) => {
    builder.integer("score").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("commit", (builder) => {
    builder.dropColumn("score");
  });
}
