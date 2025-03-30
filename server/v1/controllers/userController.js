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
        if (!userData.userID) {
            ctx.status = 400;
            ctx.body = {
                status: "error",
                message: "User ID is required."
            };
            return;
        }
        ensureFields(userData, {
            displayName: "newUser",
            email: "",
            photoURL: "",
        })
        const resultData = await userService.createUser(userData);
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
