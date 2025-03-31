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
