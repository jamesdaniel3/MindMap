import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("maps", function (table) {
      table.text("creator_id_new");
    })
    .then(function () {
      return knex.raw(`
        UPDATE maps
        SET
            creator_id_new = creator_id::text
        `);
    })
    .then(function () {
      return knex.schema.alterTable("maps", function (table) {
        table.dropColumn("creator_id");
      });
    })
    .then(function () {
      return knex.schema.alterTable("maps", function (table) {
        table.renameColumn("creator_id_new", "creator_id");
      });
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("maps", function (table) {
      table.integer("creator_id_old");
    })
    .then(function () {
      return knex.raw(`
            UPDATE maps
            SET
                creator_id_old = creator_id::integer
            `);
    })
    .then(function () {
      return knex.schema.alterTable("maps", function (table) {
        table.dropColumn("creator_id");
      });
    })
    .then(function () {
      return knex.schema.alterTable("maps", function (table) {
        table.renameColumn("creator_id_old", "creator_id");
      });
    });
}
