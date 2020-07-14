import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("user", (builder) => {
    builder.text("email").notNullable().defaultTo("");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("user", (builder) => {
    builder.dropColumn("email");
  });
}
