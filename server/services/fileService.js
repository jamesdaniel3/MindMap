// services/fileService.js
const { db } = require("../config/firebase");
const {
  uploadFile: gcsUploadFile,
  downloadFile: gcsDownloadFile,
  getSignedUrl: gcsGetSignedUrl,
  deleteFile: gcsDeleteFile,
} = require("../config/storage");

/**
 * Upload a file to Google Cloud Storage
 * @param {Object} file - File object from multer
 * @param {String} customName - Optional custom filename
 * @returns {Promise<Object>} - File information
 */
async function uploadFile(file, customName = null) {
  try {
    // Upload file to GCS
    const uploadInfo = await gcsUploadFile(file, customName);

    // Optionally: Store file metadata in Firestore
    const fileRef = db.collection("Files").doc(uploadInfo.fileName);
    await fileRef.set({
      fileName: uploadInfo.fileName,
      originalName: file.originalname,
      publicUrl: uploadInfo.publicUrl,
      contentType: file.mimetype,
      size: file.size,
      uploadedAt: new Date(),
    });

    return uploadInfo;
  } catch (error) {
    console.error("Error in upload file service:", error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

/**
 * Get a file from Google Cloud Storage
 * @param {String} fileName - Name of the file to retrieve
 * @returns {Promise<Buffer>} - File content
 */
async function getFile(fileName) {
  try {
    // Get file from GCS
    return await gcsDownloadFile(fileName);
  } catch (error) {
    console.error("Error in get file service:", error);
    throw error; // Preserve original error for specific handling
  }
}

/**
 * Get a signed URL for a file
 * @param {String} fileName - Name of the file
 * @param {Number} expires - Expiration time in minutes
 * @returns {Promise<String>} - Signed URL
 */
async function getSignedUrl(fileName, expires = 15) {
  try {
    // Get signed URL from GCS
    return await gcsGetSignedUrl(fileName, expires);
  } catch (error) {
    console.error("Error in get signed URL service:", error);
    throw error;
  }
}

/**
 * Delete a file from Google Cloud Storage
 * @param {String} fileName - Name of the file to delete
 * @returns {Promise<Boolean>} - Success status
 */
async function deleteFile(fileName) {
  try {
    // Delete file from GCS
    await gcsDeleteFile(fileName);

    // Delete metadata from Firestore
    const fileRef = db.collection("Files").doc(fileName);
    await fileRef.delete();

    return true;
  } catch (error) {
    console.error("Error in delete file service:", error);
    throw error;
  }
}

module.exports = {
  uploadFile,
  getFile,
  getSignedUrl,
  deleteFile,
};
