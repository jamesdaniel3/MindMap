// services/mapService.js
const { db } = require("../config/firebase");

async function createNode(nodeData) {
  const newNodeRef = await db.collection("Node").add(nodeData).catch((error) => {
    return null;
  });
  return newNodeRef.id;
}

module.exports = {
  createNode,
};
