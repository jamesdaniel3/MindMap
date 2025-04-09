import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("users", function (table) {
      table.unique(["google_user_id"]);
    })
    .then(function () {
      return knex.schema.alterTable("maps", function (table) {
        table
          .foreign("creator_id")
          .references("google_user_id")
          .inTable("users")
          .onDelete("CASCADE");
      });
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("maps", function (table) {
      table.dropForeign(["creator_id"]);
    })
    .then(function () {
      return knex.schema.alterTable("users", function (table) {
        table.dropUnique(["google_user_id"]);
      });
    });
}
