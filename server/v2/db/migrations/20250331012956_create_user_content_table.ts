import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("user_content", (table) => {
    table.increments("id").primary();
    table.boolean("completed").notNullable().defaultTo(false);
    table.integer("assignment_id").unsigned().notNullable();
    table.integer("user_id").unsigned().notNullable();
    table.text("content").notNullable();
    table.timestamps(true, true);

    // Foreign key constraints
    table
      .foreign("assignment_id")
      .references("id")
      .inTable("assignments")
      .onDelete("CASCADE");
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    // Composite unique constraint to ensure one content per user per assignment
    table.unique(["user_id", "assignment_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("user_content");
}
