import { getAllMaps } from "../services/mapServices";
import { Context } from "koa";

export const allMaps = async (ctx: Context): Promise<void> => {
  try {
    const allMapData = await getAllMaps();

    if (allMapData.length === 0) {
      ctx.status = 201; // sentinel value to make it easy to check the case where there are no maps but there were no errors
      ctx.body = "No maps found";
    } else {
      ctx.status = 200;
      ctx.body = { mapData: allMapData };
    }
  } catch (err) {
    console.error("Error retrieving maps:", err);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
};
