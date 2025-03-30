// middleware/errorHandler.js
const { formatResponse } = require("../utils/responseFormatter");

/**
 * Global error handling middleware
 * @param {Object} ctx - Koa context
 * @param {Function} next - Next middleware
 * @returns {Promise<void>}
 */
async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (err) {
    console.error("Server error:", err);
    ctx.status = err.status || 500;
    ctx.body = formatResponse(null, {
      success: false,
      error: err.message || "Internal Server Error",
      statusCode: ctx.status,
    });

    // Emit the error so it can be logged or handled elsewhere too
    ctx.app.emit("error", err, ctx);
  }
}

module.exports = errorHandler;
