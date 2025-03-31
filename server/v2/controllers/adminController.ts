import { Context } from "koa";
import { doDbMigrations, doDbRollbacks } from "../services/adminServices";

// Helper function for API key authorization using URL param
const checkApiKey = (ctx: Context): boolean => {
  const apiKey = ctx.params.api_key;
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    ctx.status = 401;
    ctx.body = { success: false, message: "Unauthorized" };
    return false;
  }
  return true;
};

export const dbMigrations = async (ctx: Context): Promise<void> => {
  try {
    // Check authorization
    if (!checkApiKey(ctx)) return;

    // Run migrations
    const result = await doDbMigrations();

    // Return success response
    ctx.status = 200;
    ctx.body = {
      success: true,
      message: "Database migrations completed successfully",
      data: result,
    };
  } catch (error) {
    // Handle errors
    console.error("Migration error:", error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unknown error during migration",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    };
  }
};

export const dbRollbacks = async (ctx: Context): Promise<void> => {
  try {
    // Check authorization
    if (!checkApiKey(ctx)) return;

    // Run rollbacks
    const result = await doDbRollbacks();

    // Return success response
    ctx.status = 200;
    ctx.body = {
      success: true,
      message: `Database rollback completed successfully (1 migration)`,
      data: result,
    };
  } catch (error) {
    // Handle errors
    console.error("Rollback error:", error);
    ctx.status = 500;
    ctx.body = {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unknown error during rollback",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    };
  }
};
