// services/mapService.js
const { db } = require("../config/firebase");

/**
 * Get all maps from Firestore
 * @returns {Promise<Array>} - Array of map objects
 */
async function getAllMaps() {
  try {
    const mapsRef = db.collection("Map");
    const snapshot = await mapsRef.get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error in map service:", error);
    throw new Error("Failed to fetch maps");
  }
}

async function createMap(mapData) {
  const newMapRef = await db.collection("Map").add(mapData).catch((error) => {
    return null;
  });
  return newMapRef.id;
}

async function getMap(mapID) {
  const mapSnapshot = await db.collection("Map").doc(mapID).get();
  return mapSnapshot.data();
}

module.exports = {
  getAllMaps,
  createMap,
  getMap,
};
