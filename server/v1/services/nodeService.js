// services/mapService.js
const { db } = require("../config/firebase");

async function createNode(nodeData) {
    const newNodeRef = await db.collection("Node").add(nodeData).catch((error) => {
        return null;
    });
    return newNodeRef.id;
}

async function getNode(nodeID) {
    const nodeRef = db.collection("Node").doc(nodeID)
    const nodeSnapshot = await nodeRef.get();
    if (!nodeSnapshot.exists) {
        return null;
    }
    const nodeData = nodeSnapshot.data();
    nodeData.nodeID = nodeRef.id;
    return nodeData;
}

module.exports = {
    createNode,
    getNode,
};
