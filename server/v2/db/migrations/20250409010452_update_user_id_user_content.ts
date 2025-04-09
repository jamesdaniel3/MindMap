import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("user_content", function (table) {
      table.text("user_id_new");
    })
    .then(function () {
      return knex.raw(`
        UPDATE user_content
        SET
            user_id_new = user_id::text
        `);
    })
    .then(function () {
      return knex.schema.alterTable("user_content", function (table) {
        table.dropColumn("user_id");
      });
    })
    .then(function () {
      return knex.schema
        .alterTable("user_content", function (table) {
          table.renameColumn("user_id_new", "user_id");
        })
        .then(function () {
          return knex.schema.alterTable("user_content", function (table) {
            table
              .foreign("user_id")
              .references("google_user_id")
              .inTable("users")
              .onDelete("CASCADE");
          });
        });
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("user_content", function (table) {
      table.integer("user_id_old");
    })
    .then(function () {
      return knex.raw(`
            UPDATE user_content
            SET
                user_id_old = user_id::integer
            `);
    })
    .then(function () {
      return knex.schema.alterTable("user_content", function (table) {
        table.dropColumn("user_id");
      });
    })
    .then(function () {
      return knex.schema.alterTable("user_content", function (table) {
        table.renameColumn("user_id_old", "user_id");
      });
    });
}
