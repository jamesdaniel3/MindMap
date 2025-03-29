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

// Service methods for other user operations would go here

module.exports = {
  getAllUsers,
  // Export other service methods here
};
