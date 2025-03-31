import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table("users", function (table) {
    table.integer("google_user_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table("users", function (table) {
    table.dropColumn("google_user_id");
  });
}
