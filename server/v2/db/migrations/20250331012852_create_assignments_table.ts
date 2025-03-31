import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("assignments", (table) => {
    table.increments("id").primary();
    table.integer("node_id").unsigned().notNullable();
    table.string("name").notNullable();
    table.integer("type").notNullable();
    table.text("content").notNullable();
    table.timestamps(true, true);

    // Foreign key constraint
    table
      .foreign("node_id")
      .references("id")
      .inTable("nodes")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("assignments");
}
