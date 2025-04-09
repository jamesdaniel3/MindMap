import {
  AllMapInfoRetrievalRequest,
  MapCreationRequest,
} from "../interfaces/mapInterfaces";
import { getAllMaps, createMap, getMap } from "../services/mapServices";
import { Context } from "koa";
import { findUser } from "../services/userServices";
import { createNode } from "../services/nodeServices";
import { getAssignmentsForNode } from "../services/assignmentServices";

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
    console.error("Error creating map:", err);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
};

export const mapLoader = async (ctx: Context): Promise<void> => {
  try {
    const { userId, mapId } = ctx.request.body as AllMapInfoRetrievalRequest;

    const mapInfo = await getMap({ mapId });
    const fullMapInfo = {
      ...mapInfo,
      is_owner: mapInfo.creator_id === userId ? true : false,
    };

    for (let index = 0; index < fullMapInfo.nodes.length; index++) {
      const assignmentList = await getAssignmentsForNode({
        nodeId: fullMapInfo.nodes[index].id,
      });
      fullMapInfo.nodes[index] = {
        ...fullMapInfo.nodes[index],
        assignments: assignmentList,
      };
    }

    ctx.status = 200;
    ctx.body = { fullMapInfo: fullMapInfo };
  } catch (err) {
    console.error("Error loading map:", err);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
};
