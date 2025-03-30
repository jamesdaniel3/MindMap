// config/storage.js
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const fs = require("fs");

let storage;

// First, try to use service account file
const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");

if (fs.existsSync(serviceAccountPath)) {
  storage = new Storage({
    keyFilename: serviceAccountPath,
  });
} else {
  // Fallback to environment variables (default credentials)
  console.log(
    "Service account file not found, using environment variables or default credentials"
  );
  storage = new Storage();
}

// The name of your GCS bucket
const bucketName = process.env.GCS_BUCKET_NAME;

// Get a reference to the bucket
const bucket = storage.bucket(bucketName);

/**
 * Uploads a file to Google Cloud Storage
 * @param {Object} file - The file to upload (with buffer, originalname properties)
 * @param {String} customName - Optional custom filename
 * @returns {Promise<Object>} - File information including public URL
 */
async function uploadFile(file, customName = null) {
  try {
    // Create a unique filename or use the provided custom name
    const fileName =
      customName || `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;

    // Create a reference to a file object in the bucket
    const fileUpload = bucket.file(fileName);

    // Upload the file to GCS
    await fileUpload.save(file.buffer, {
      contentType: file.mimetype,
      // Optional: Make the file publicly accessible
      metadata: {
        // Optional: Add custom metadata
        metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    // Make the file publicly accessible (if not already)

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    return {
      fileName,
      publicUrl,
      contentType: file.mimetype,
      size: file.size,
    };
  } catch (error) {
    console.error("Error uploading file to GCS:", error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

/**
 * Downloads a file from Google Cloud Storage
 * @param {String} fileName - The name of the file to download
 * @returns {Promise<Buffer>} - The file content as a buffer
 */
async function downloadFile(fileName) {
  try {
    const file = bucket.file(fileName);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error("File not found");
    }

    // Get the file content
    const [content] = await file.download();

    return content;
  } catch (error) {
    console.error("Error downloading file from GCS:", error);
    throw new Error(`Failed to download file: ${error.message}`);
  }
}

/**
 * Gets a signed URL for a file (time-limited access)
 * @param {String} fileName - The name of the file
 * @param {Number} expires - URL expiration time in minutes (default: 15)
 * @returns {Promise<String>} - Signed URL
 */
async function getSignedUrl(fileName, expires = 15) {
  try {
    const file = bucket.file(fileName);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error("File not found");
    }

    // Create a signed URL that expires after specified minutes
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + expires * 60 * 1000,
    });

    return url;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
}

/**
 * Deletes a file from Google Cloud Storage
 * @param {String} fileName - The name of the file to delete
 * @returns {Promise<Boolean>} - Success status
 */
async function deleteFile(fileName) {
  try {
    const file = bucket.file(fileName);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      throw new Error("File not found");
    }

    // Delete the file
    await file.delete();

    return true;
  } catch (error) {
    console.error("Error deleting file from GCS:", error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}

module.exports = {
  storage,
  bucket,
  bucketName,
  uploadFile,
  downloadFile,
  getSignedUrl,
  deleteFile,
};
