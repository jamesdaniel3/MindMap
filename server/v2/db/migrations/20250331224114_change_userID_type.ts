import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("users", function (table) {
      table.text("google_user_id_new");
    })
    .then(function () {
      return knex.raw(`
      UPDATE users 
      SET 
        google_user_id_new = google_user_id::text
      `);
    })
    .then(function () {
      return knex.schema.alterTable("users", function (table) {
        // Drop the original column
        table.dropColumn("google_user_id");
      });
    })
    .then(function () {
      return knex.schema.alterTable("users", function (table) {
        // Rename the new column to the original name
        table.renameColumn("google_user_id_new", "google_user_id");
      });
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("users", function (table) {
      table.integer("google_user_id_old");
    })
    .then(function () {
      return knex.raw(`
      UPDATE users 
      SET 
        google_user_id_old = google_user_id::integer
      `);
    })
    .then(function () {
      return knex.schema.alterTable("users", function (table) {
        table.dropColumn("google_user_id");
      });
    })
    .then(function () {
      return knex.schema.alterTable("users", function (table) {
        table.renameColumn("google_user_id_old", "google_user_id");
      });
    });
}
