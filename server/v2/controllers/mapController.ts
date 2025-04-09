import {
  AllMapInfoRetrievalRequest,
  MapCreationRequest,
} from "../interfaces/mapInterfaces";
import { getAllMaps, createMap, getMap } from "../services/mapServices";
import { Context } from "koa";
import { findUser } from "../services/userServices";
import {
  createNode,
  getNodePostreqs,
  getNodePrereqs,
} from "../services/nodeServices";
import { getAssignmentsForNode } from "../services/assignmentServices";
import { getUserContentForAssignment } from "../services/userContentService";
import { DBUserContentModel } from "../interfaces/userContentInterfaces";

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

    // add need info for each node into the node objects
    for (let index = 0; index < fullMapInfo.nodes.length; index++) {
      const assignmentList = await getAssignmentsForNode({
        nodeId: fullMapInfo.nodes[index].id,
      });
      const prereqsList = await getNodePrereqs({
        nodeId: fullMapInfo.nodes[index].id,
      });
      const postreqsList = await getNodePostreqs({
        nodeId: fullMapInfo.nodes[index].id,
      });

      fullMapInfo.nodes[index] = {
        ...fullMapInfo.nodes[index],
        assignments: assignmentList,
        prereqs: prereqsList,
        postreqs: postreqsList,
      };
    }

    if (fullMapInfo.is_owner) {
      ctx.status = 200;
      ctx.body = { fullMapInfo: fullMapInfo };
      return;
    }

    const userContents: { [nodeId: string]: DBUserContentModel } = {};
    const nodesToKeep = [];

    for (const node of fullMapInfo.nodes) {
      // type guard needed for TS to resolve types
      if (!("assignments" in node)) {
        continue;
      }

      let hasUserContent = false;
      let isRootNode = false;

      for (const assignment of node.assignments) {
        const userContent = await getUserContentForAssignment({
          googleUserId: userId,
          assignmentId: assignment.id,
        });

        if (userContent) {
          hasUserContent = true;
          userContents[node.id.toString()] = userContent;
        }
      }

      if (node.prereqs.length === 0) {
        isRootNode = true;
      }

      // if the node has no user content and is not a root node it should be filtered out
      if (hasUserContent || isRootNode) {
        nodesToKeep.push(node);
      }
    }

    fullMapInfo.nodes = nodesToKeep;
    ctx.status = 200;
    ctx.body = { fullMapInfo: fullMapInfo, userContents: userContents };
  } catch (err) {
    console.error("Error loading map:", err);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
};
