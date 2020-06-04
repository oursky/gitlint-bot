import * as Knex from "knex";

const commitTableName = "commit";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    commitTableName,
    (builder: Knex.TableBuilder) => {
      builder.text("id").notNullable().primary();
      builder.text("message").notNullable();
      builder.timestamp("committed_at");
      builder.integer("user_id").notNullable();
      builder.foreign("user_id").references("id").inTable("user");
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(commitTableName);
}
