// services/userService.js
const { db } = require("../config/firebase");

/**
 * Get all users from Firestore
 * @returns {Promise<Array>} - Array of user objects
 */
async function getAllUsers() {
  try {
    const usersRef = db.collection("User");
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error in user service:", error);
    throw new Error("Failed to fetch users");
  }
}

async function createUser(userData) {
    const docRef = db.collection("User").doc(userData.userID);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
        return {
            result: "error",
            message: `User ${userData.userID} already exists`
        };
    }
    await docRef.set(userData).catch((error) => {
        return {
            result: "error",
            message: `Error writing document for user`
        };
    })
    return {
        result: "success",
        message: `User ${userData.userID} created successfully`
    };
}

module.exports = {
    getAllUsers,
    createUser,
};
