import { Context } from "koa";
import { checkDatabaseHealth } from "../services/healthCheck";

export const dbHealthCheck = async (ctx: Context): Promise<void> => {
  try {
    const health = await checkDatabaseHealth();

    ctx.status = health.status === "up" ? 200 : 503;
    ctx.body = health;
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      status: "error",
      mmessage: "Failed to perform health check",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
