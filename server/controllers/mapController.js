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

// Controller methods for other map operations would go here

module.exports = {
  getAllMaps,
  // Export other controller methods here
};
