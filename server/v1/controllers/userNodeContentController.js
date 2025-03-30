// controllers/mapController.js
const util = require("../utils/controllerUtils")

const userNodeContentService = require("../services/userNodeContentService");
const { formatResponse } = require("../utils/responseFormatter");

async function createUserNodeContent(userNodeContentData) {
    if (!userNodeContentData) {
        userNodeContentData = {};
    }
    if (!("userID" in userNodeContentData)) {
        throw Error("Need userID to create userNodeContent");
    }
    if (!("userNodeContentID" in userNodeContentData)) {
        throw Error("Need userNodeContentID to create userNodeContent")
    }
    util.ensureFields(userNodeContentData, {
        content: "",
        completed: false,
    })
    return await userNodeContentService.createUserNodeContent(userNodeContentData);
}

async function getUserNodeContent(userNodeID, nodeContentID) {
    return await userNodeContentService.getUserNodeContent(userNodeID, nodeContentID);
}

module.exports = {
    createUserNodeContent,
    getUserNodeContent,
};

