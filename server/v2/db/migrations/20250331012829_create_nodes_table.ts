import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("nodes", (table) => {
    table.increments("id").primary();
    table.integer("map_id").unsigned().notNullable();
    table.string("name").notNullable();
    table.timestamps(true, true);

    // Foreign key constraint
    table
      .foreign("map_id")
      .references("id")
      .inTable("maps")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("nodes");
}
