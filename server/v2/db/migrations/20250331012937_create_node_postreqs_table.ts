import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("node_postreqs", (table) => {
    table.increments("id").primary();
    table.integer("current_node_id").unsigned().notNullable();
    table.integer("postreq_node_id").unsigned().notNullable();
    table.timestamps(true, true);

    // Foreign key constraints
    table
      .foreign("current_node_id")
      .references("id")
      .inTable("nodes")
      .onDelete("CASCADE");
    table
      .foreign("postreq_node_id")
      .references("id")
      .inTable("nodes")
      .onDelete("CASCADE");

    // Composite unique constraint to prevent duplicate postrequisites
    table.unique(["current_node_id", "postreq_node_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("node_postreqs");
}
