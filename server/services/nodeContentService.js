// services/mapService.js
const { db } = require("../config/firebase");

async function createNodeContent(nodeContentData) {
    const newNodeContentRef = await db.collection("NodeContent").add(nodeContentData).catch((error) => {
        return null;
    });
    return newNodeContentRef.id;
}

async function getNodeContent(nodeContentID) {
    const nodeContentRef = db.collection("NodeContent").doc(nodeContentID)
    const nodeContentSnapshot = await nodeContentRef.get();
    if (!nodeContentSnapshot.exists) {
        return null;
    }
    const nodeContentData = nodeContentSnapshot.data();
    nodeContentData.nodeContentID = nodeContentRef.id;
    return nodeContentData;
}

module.exports = {
    createNodeContent,
    getNodeContent,
};
