// controllers/userController.js
const userService = require("../services/userService");
const { formatResponse } = require("../utils/responseFormatter");

/**
 * Get all users
 * @param {Object} ctx - Koa context
 * @returns {Promise<void>}
 */
async function getAllUsers(ctx) {
  try {
    const users = await userService.getAllUsers();
    ctx.body = formatResponse(users);
  } catch (error) {
    ctx.app.emit("error", error, ctx);
  }
}

// Controller methods for other user operations would go here

module.exports = {
  getAllUsers,
  // Export other controller methods here
};
