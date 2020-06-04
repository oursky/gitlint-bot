import * as Knex from "knex";

const commitTableName = "commit";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    commitTableName,
    (builder: Knex.TableBuilder) => {
      builder.increments("id").primary();
      builder.text("message").notNullable();
      builder.timestamp("created_at").defaultTo(knex.fn.now());
      builder.integer("userId").unsigned().notNullable();
      builder.foreign("userId").references("id").inTable("user");
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(commitTableName);
}
