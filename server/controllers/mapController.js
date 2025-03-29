// controllers/mapController.js
const mapService = require("../services/mapService");
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

async function createMap(ctx) {
  try {
    const mapData = ctx.request.body;
    if (!mapData.userID) {
      ctx.status = 400;
      ctx.body = {
          status: "error",
          message: "userID is required."
      };
      return;
    }
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

// Controller methods for other map operations would go here

module.exports = {
  getAllMaps,
  createMap,
};
