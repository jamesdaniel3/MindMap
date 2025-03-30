import { Context, Next } from "koa";

export const errorHandler = async (ctx: Context, next: Next): Promise<void> => {
  try {
    await next();
  } catch (err) {
    const error = err as Error;

    // keep the code if it's a valid error code, otherwise set it to 500
    ctx.status = ctx.status >= 400 && ctx.status < 500 ? ctx.status : 500;

    ctx.body = {
      status: "error",
      message: error.message || "Internal Server Error",
      ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
    };

    console.error("Server Error:", error);

    ctx.app.emit("error", error, ctx);
  }
};
