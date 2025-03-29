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

async function createUser(ctx) {
    try {
        const userData = ctx.request.body;
        // TODO: pull out as isMissingFields([fields]), return missing field(s)
        if (!userData.userID) {
            ctx.status = 400;
            ctx.body = {
                status: "error",
                message: "User ID is required."
            };
            return;
        }
        const resultData = await userService.createUser(userData);
        // TODO: pull this out
        ctx.status = resultData.result == "success" ? 201 : 400;
        ctx.body = {
            status: resultData.result,
            message: resultData.message
        };
    } catch (error) {
        ctx.throw(500, error.message);
    }
}

module.exports = {
    getAllUsers,
    createUser,
};
