// controllers/mapController.js
const util = require("../utils/controllerUtils")

const nodeContentService = require("../services/nodeContentService");
const { formatResponse } = require("../utils/responseFormatter");

const NodeContentType = Object.freeze({
    TEXT: 0,
})

async function createNodeContent(nodeContentData) {
    if (!nodeContentData) {
        nodeContentData = {};
    }
    util.ensureFields(nodeContentData, {
        content: "",
        title: "New Content",
        type: NodeContentType.TEXT,
    })
    return await nodeContentService.createNodeContent(nodeContentData);
}

async function getNodeContent(nodeContentID) {
    return await nodeContentService.getNodeContent(nodeContentID);
}

module.exports = {
    createNodeContent,
    NodeContentType,
    getNodeContent,
};

