// controllers/mapController.js
const nodeService = require("../services/nodeService");
const { formatResponse } = require("../utils/responseFormatter");

async function APICreateNode(ctx) {
    try {
        const nodeData = ctx.request.body;
        const newNodeID = await createNode(nodeData);
        ctx.status = !newNodeID ? 400 : 201;
        ctx.body = {
            status: !newNodeID ? "error" : "success",
            message: !newNodeID ? "Failed creating node" : "Successfully created node",
            mapID: newNodeID
        }
    } catch (error) {
        ctx.throw(500, error.message);
    }
}

async function createNode(nodeData) {
    return await nodeService.createNode(nodeData);
}

module.exports = {
    APICreateNode,
    createNode,
};
