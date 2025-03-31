export interface MigrationResult {
  migrationCount: number;
  completedMigrations: string[];
}

export interface RollbackResult {
  rollbackCount: number;
  rolledBackMigrations: string[];
}
