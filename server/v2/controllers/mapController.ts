import { MapCreationRequest } from "../interfaces/mapInterfaces";
import { getAllMaps, createMap } from "../services/mapServices";
import { Context } from "koa";

export const allMaps = async (ctx: Context): Promise<void> => {
  try {
    const allMapData = await getAllMaps();

    if (allMapData.length === 0) {
      ctx.status = 201; // sentinel value to make it easy to check the case where there are no maps but there were no errors
      ctx.body = { allMapData: "No maps found" };
    } else {
      ctx.status = 200;
      ctx.body = { allMapData: allMapData };
    }
  } catch (err) {
    console.error("Error retrieving maps: ", err);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
};

export const mapCreater = async (ctx: Context): Promise<void> => {
  try {
    const { creator_id, name } = ctx.request.body as MapCreationRequest;
    const newMapData = await createMap({ creator_id: creator_id, name: name });

    ctx.status = 200;
    ctx.body = { newMapData: newMapData };
  } catch (err) {
    console.error("Error creating map: ", err);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
};
