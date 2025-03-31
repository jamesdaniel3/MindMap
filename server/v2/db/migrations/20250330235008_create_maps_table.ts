import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("maps", (table) => {
    table.increments("id").primary();
    table.integer("creator_id").unsigned().notNullable();
    table.string("name").notNullable();
    table.timestamps(true, true);

    // Foreign key constraint
    table
      .foreign("creator_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("maps");
}
