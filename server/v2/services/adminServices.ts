import knex from "../db/db";

interface MigrationResult {
  migrationCount: number;
  completedMigrations: string[];
}

export const doDbMigrations = async (): Promise<MigrationResult> => {
  try {
    // Run latest migrations
    const [completedMigrations, migrationCount] = await knex.migrate.latest();

    // Log results
    console.log(`Ran ${migrationCount} migrations`);
    console.log("Completed migrations:", completedMigrations);

    return {
      migrationCount,
      completedMigrations,
    };
  } catch (error) {
    console.error("Migration service error:", error);
    throw error; // Let the controller handle the error
  }
};

interface RollbackResult {
  rollbackCount: number;
  rolledBackMigrations: string[];
}

export const doDbRollbacks = async (): Promise<RollbackResult> => {
  try {
    // Perform rollback
    const [rolledBackMigrations, rollbackCount] = await knex.migrate.rollback(
      {}
    );

    // Log results
    console.log(
      `Rolled back ${rollbackCount} migration${rollbackCount !== 1 ? "s" : ""}`
    );
    console.log("Rolled back migrations:", rolledBackMigrations);

    return {
      rollbackCount,
      rolledBackMigrations,
    };
  } catch (error) {
    console.error("Rollback service error:", error);
    throw error; // Let the controller handle the error
  }
};
