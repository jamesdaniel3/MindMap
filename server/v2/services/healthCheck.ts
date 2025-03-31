import db from "../db/db";
import { HeatlthStatus } from "../interfaces/healthInterfaces";

export const checkDatabaseHealth = async (): Promise<HeatlthStatus> => {
  const startTime = Date.now();

  try {
    await db.raw("SELECT 1");
    const responseTime = Date.now() - startTime;

    return {
      status: "up",
      message: "Service is healthy",
      timestamp: new Date().toISOString(),
      details: {
        database: {
          status: "up",
          message: "Database connection is healthy",
          responseTime: responseTime,
        },
      },
    };
  } catch (error) {
    return {
      status: "down",
      message: "Service is not healthy",
      timestamp: new Date().toISOString(),
      details: {
        database: {
          status: "down",
          message:
            error instanceof Error ? error.message : "Unknown database error",
        },
      },
    };
  }
};
