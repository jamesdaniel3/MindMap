// services/mapService.js
const { db } = require("../config/firebase");

async function createUserNodeContent(userNodeContentData) {
    const newUserNodeContentRef = await db.collection("UserNodeContent").add(userNodeContentData).catch((error) => {
        return null;
    });
    return newUserNodeContentRef.id;
}

async function getUserNodeContent(userID, nodeContentID) {
    const userNodeContentRef = db.collection("UserNodeContent")
        .where("userID", "==", userID)
        .where("nodeContentID", "==", nodeContentID)
        .limit(1);
    const userNodeContentSnapshot = await userNodeContentRef.get();
    if (userNodeContentSnapshot.empty) {
        return null;
    }
    const doc = userNodeContentSnapshot.docs[0];
    const userNodeContentData = doc.data();
    if (!userNodeContentData) {
        return null;
    }
    userNodeContentData.userNodeContentID = doc.id;
    return userNodeContentData;
}

module.exports = {
    createUserNodeContent,
    getUserNodeContent,
};
