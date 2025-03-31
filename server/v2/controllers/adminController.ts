import { Context } from "koa";
import { doDbMigrations, doDbRollbacks } from "../services/adminServices";

export const dbMigrations = async (ctx: Context): Promise<void> => {
  try {
    // Check for authorization - you might want to add middleware for this
    // This is a simple check, consider implementing proper auth middleware
    // const apiKey = ctx.request.headers["x-api-key"];
    // if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    //   ctx.status = 401;
    //   ctx.body = { success: false, message: "Unauthorized" };
    //   return;
    // }

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
