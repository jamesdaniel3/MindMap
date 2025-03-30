// config/firebase.js
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");
const fs = require("fs");

let firebaseConfig;

// First try to use service account file
const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");

if (fs.existsSync(serviceAccountPath)) {
  const serviceAccount = require(serviceAccountPath);
  firebaseConfig = {
    credential: cert(serviceAccount),
  };
} else {
  // Fallback to environment variables
  console.log("Service account file not found, using environment variables");
  firebaseConfig = {
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  };
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();

module.exports = {
  db,
  firebaseApp,
};
