import { Context, Next } from "koa";

export const logger = async (ctx: Context, next: Next): Promise<void> => {
  const start = Date.now();

  await next();

  const ms = Date.now() - start;
  const logLevel =
    ctx.status >= 500 ? "error" : ctx.status >= 400 ? "warn" : "info";

  console[logLevel](`${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`);
};
