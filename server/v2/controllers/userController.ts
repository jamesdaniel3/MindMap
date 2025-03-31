import { Context } from "koa";
import { findOrCreate } from "../services/userServices";
import { UserFindOrCreateRequest } from "../interfaces/userInterfaces";

export const userFindOrCreate = async (ctx: Context): Promise<void> => {
  try {
    const { googleUserId, displayName, email, photo_url } = ctx.request
      .body as UserFindOrCreateRequest;

    // Validate required fields
    if (!googleUserId || !displayName || !email) {
      ctx.status = 400;
      ctx.body = {
        error:
          "Missing required fields: userId, displayName, and email are required",
      };
      return;
    }

    const user = await findOrCreate({
      googleUserId,
      displayName,
      email,
      photo_url,
    });

    ctx.status = 200;
    ctx.body = { user };
  } catch (error) {
    console.error("Error in userFindOrCreate:", error);
    ctx.status = 500;
    ctx.body = { error: "Internal server error" };
  }
};
