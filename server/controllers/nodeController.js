// controllers/mapController.js
const util = require("../utils/controllerUtils")

const nodeService = require("../services/nodeService");
const nodeContentController = require("../controllers/nodeContentController")
const { formatResponse } = require("../utils/responseFormatter");

async function APICreateNode(ctx) {
    try {
        const nodeData = ctx.request.body;
        const newNodeID = await createNode(nodeData);
        ctx.status = !newNodeID ? 400 : 201;
        ctx.body = {
            status: !newNodeID ? "error" : "success",
            message: !newNodeID ? "Failed creating node" : "Successfully created node",
            nodeID: newNodeID
        }
    } catch (error) {
        ctx.throw(500, error.message);
    }
}

async function createNode(nodeData) {
    if (!nodeData) {
        nodeData = {};
    }
    util.ensureFields(nodeData, {
        collections: [],
        name: "",
        postreqs: [],
        prereqs: [],
    })
    if (!("contents" in nodeData)) {
        const blankNodeContentData = await nodeContentController.createNodeContent();
        nodeData.contents = new Array(blankNodeContentData);
    }
    return await nodeService.createNode(nodeData);
}

async function getNode(nodeID) {
    return await nodeService.getNode(nodeID);
}

module.exports = {
    APICreateNode,
    createNode,
    getNode,
};
