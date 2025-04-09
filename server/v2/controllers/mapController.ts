import { MapCreationRequest } from "../interfaces/mapInterfaces";
import { getAllMaps, createMap } from "../services/mapServices";
import { Context } from "koa";
import { findUser } from "../services/userServices";
import { createNode } from "../services/nodeServices";

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

export const mapCreator = async (ctx: Context): Promise<void> => {
  try {
    const { creator_id, name } = ctx.request.body as MapCreationRequest;
    const userFindResults = await findUser({ googleUserId: creator_id });

    if (!userFindResults.userExists) {
      ctx.status = 500;
      ctx.body = { error: "No user can be found with ID", creator_id };
    } else {
      const newMapData = await createMap({
        creator_id: creator_id,
        name: name,
      });

      // create the first node for the map
      const firstNodeData = await createNode({
        mapID: newMapData.id,
        name: "Node 1",
      });

      ctx.status = 200;
      ctx.body = { newMapData: newMapData };
    }
  } catch (err) {
    console.error("Error creating map: ", err);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
};
