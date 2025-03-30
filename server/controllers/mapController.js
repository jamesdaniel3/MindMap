// controllers/mapController.js
const util = require("../utils/controllerUtils")

const mapService = require("../services/mapService");
const nodeController = require("../controllers/nodeController");
const nodeContentController = require("../controllers/nodeContentController");
const userNodeContentController = require("../controllers/userNodeContentController");
const { formatResponse } = require("../utils/responseFormatter");

/**
 * Get all maps
 * @param {Object} ctx - Koa context
 * @returns {Promise<void>}
 */
async function getAllMaps(ctx) {
  try {
    const maps = await mapService.getAllMaps();
    ctx.body = formatResponse(maps);
  } catch (error) {
    ctx.app.emit("error", error, ctx);
  }
}

async function initMap(ctx) {
  try {
    // TODO: Add name if missing
    const mapData = ctx.request.body;
    if (!mapData.userID) {
      ctx.status = 400;
      ctx.body = {
          status: "error",
          message: "userID is required."
      };
      return;
    }
    const rootNodeID = await nodeController.createNode({
      name: "New Node",
    });
    mapData.nodes = [rootNodeID];
    util.ensureField(mapData, "name", "New Map");
    const newMapID = await mapService.createMap(mapData);
    ctx.status = !newMapID ? 400 : 201;
    ctx.body = {
      status: !newMapID ? "error" : "success",
      message: !newMapID ? "Failed creating map" : "Successfully created map",
      mapID: newMapID
    }
  } catch (error) {
    ctx.throw(500, error.message);
  }
}

async function APILoadMap(ctx) {
  try {
    const loadedMapData = {}
    const body = ctx.request.body;
    const mapID = body.mapID;
    const userID = body.userID;
    if (!userID) {
      ctx.status = 400;
      ctx.body = {
          status: "error",
          message: `Need userID`
      };
      return;
    }
    // get map info: name, nodes, userID -> isOwner
    const mapData = await mapService.getMap(mapID);
    if (!mapData) {
      ctx.status = 400;
      ctx.body = {
          status: "error",
          message: `Could not find map for ID=${mapID}`
      };
      return;
    }
    loadedMapData.name = mapData.name;
    loadedMapData.isOwner = mapData.userID == userID;
    loadedMapData.nodes = new Array(mapData.nodes.length);
    // loop over nodes 
    for (let nodeInd = 0; nodeInd < mapData.nodes.length; nodeInd++) {
      const nodeID = mapData.nodes[nodeInd];
      const nodeData = await nodeController.getNode(nodeID);
      // get userNodeContent from first nodeContentID + userID. if not there and not owner, then we skip this node entirely and continue out
      if (!loadedMapData.isOwner) {
        const firstUserNodeContent = await userNodeContentController.getUserNodeContent(userID, nodeData.contents[0]);
        if (!firstUserNodeContent) {
          continue;
        }
      }
      const contents = new Array(nodeData.contents.length);
      const userContents = new Array(contents.length);
      for (let nodeContentInd = 0; nodeContentInd < nodeData.contents.length; nodeContentInd++) {
        const nodeContentID = nodeData.contents[nodeContentInd];
        const nodeContentData = await nodeContentController.getNodeContent(nodeContentID);
        contents[nodeContentInd] = {
          nodeContentID: nodeContentData.nodeContentID,
          title: nodeContentData.title
        };
        // now, if the user is not the owner, fill out the node's userContents
        if (!loadedMapData.isOwner) {
          const userNodeContentData = await userNodeContentController.getUserNodeContent(userID, nodeContentID);
          if (!userNodeContentData) {
            continue;
          }
          userContents[nodeContentInd] = {
            userNodeContentID: userNodeContentData.userNodeContentID,
            completed: userNodeContentData.completed
          }
        }
      }
      loadedMapData.nodes[nodeInd] = {
        nodeID: nodeID,
        name: nodeData.name,
        prereqs: nodeData.prereqs,
        postreqs: nodeData.postreqs,
        contents: contents,
        userContents: userContents
      };
    }
    ctx.status = 201;
    ctx.body = {
        status: "success",
        mapData: loadedMapData
    }
  } catch (e) {
    ctx.throw(500, e.message);
  }
}

module.exports = {
  getAllMaps,
  initMap,
  APILoadMap,
};
