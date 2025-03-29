// controllers/fileController.js
const fileService = require("../services/fileService");
const { formatResponse } = require("../utils/responseFormatter");

/**
 * Upload a single file to Google Cloud Storage
 * @param {Object} ctx - Koa context
 * @returns {Promise<void>}
 */
async function uploadFile(ctx) {
  try {
    const file = ctx.request.file;

    if (!file) {
      ctx.status = 400;
      ctx.body = formatResponse(null, {
        success: false,
        error: "No file uploaded",
        statusCode: 400,
      });
      return;
    }

    // Optional: Get custom filename from request body
    const customName = ctx.request.body.fileName;

    // Upload file to GCS using the service
    const fileInfo = await fileService.uploadFile(file, customName);

    // Return success response with file info
    ctx.status = 201;
    ctx.body = formatResponse(fileInfo, {
      success: true,
      message: "File uploaded successfully",
      statusCode: 201,
    });
  } catch (error) {
    ctx.app.emit("error", error, ctx);
  }
}

/**
 * Upload multiple files to Google Cloud Storage
 * @param {Object} ctx - Koa context
 * @returns {Promise<void>}
 */
async function uploadMultipleFiles(ctx) {
  try {
    const files = ctx.request.files;

    if (!files || files.length === 0) {
      ctx.status = 400;
      ctx.body = formatResponse(null, {
        success: false,
        error: "No files uploaded",
        statusCode: 400,
      });
      return;
    }

    // Upload each file to GCS
    const uploadPromises = files.map((file) => fileService.uploadFile(file));
    const fileInfos = await Promise.all(uploadPromises);

    // Return success response with all file info
    ctx.status = 201;
    ctx.body = formatResponse(fileInfos, {
      success: true,
      message: "Files uploaded successfully",
      statusCode: 201,
    });
  } catch (error) {
    ctx.app.emit("error", error, ctx);
  }
}

/**
 * Get a file from Google Cloud Storage
 * @param {Object} ctx - Koa context
 * @returns {Promise<void>}
 */
async function getFile(ctx) {
  try {
    const { fileName } = ctx.params;

    if (!fileName) {
      ctx.status = 400;
      ctx.body = formatResponse(null, {
        success: false,
        error: "File name is required",
        statusCode: 400,
      });
      return;
    }

    // Get file content
    const fileContent = await fileService.getFile(fileName);

    // Set appropriate content type
    ctx.set("Content-Disposition", `attachment; filename=${fileName}`);

    // For images and PDFs, set appropriate content type
    if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
      const extension = fileName.split(".").pop().toLowerCase();
      const mimeTypes = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
      };
      ctx.type = mimeTypes[extension] || "application/octet-stream";
    } else if (fileName.match(/\.pdf$/i)) {
      ctx.type = "application/pdf";
    } else {
      ctx.type = "application/octet-stream";
    }

    // Return the file content directly
    ctx.body = fileContent;
  } catch (error) {
    if (error.message === "File not found") {
      ctx.status = 404;
      ctx.body = formatResponse(null, {
        success: false,
        error: "File not found",
        statusCode: 404,
      });
    } else {
      ctx.app.emit("error", error, ctx);
    }
  }
}

/**
 * Get a signed URL for a file in Google Cloud Storage
 * @param {Object} ctx - Koa context
 * @returns {Promise<void>}
 */
async function getSignedFileUrl(ctx) {
  try {
    const { fileName } = ctx.params;
    // Get expiration time in minutes from query param or default to 15 minutes
    const expires = parseInt(ctx.query.expires, 10) || 15;

    if (!fileName) {
      ctx.status = 400;
      ctx.body = formatResponse(null, {
        success: false,
        error: "File name is required",
        statusCode: 400,
      });
      return;
    }

    // Get signed URL
    const signedUrl = await fileService.getSignedUrl(fileName, expires);

    // Return the signed URL
    ctx.body = formatResponse({
      fileName,
      signedUrl,
      expiresIn: `${expires} minutes`,
    });
  } catch (error) {
    if (error.message === "File not found") {
      ctx.status = 404;
      ctx.body = formatResponse(null, {
        success: false,
        error: "File not found",
        statusCode: 404,
      });
    } else {
      ctx.app.emit("error", error, ctx);
    }
  }
}

/**
 * Delete a file from Google Cloud Storage
 * @param {Object} ctx - Koa context
 * @returns {Promise<void>}
 */
async function deleteFile(ctx) {
  try {
    const { fileName } = ctx.params;

    if (!fileName) {
      ctx.status = 400;
      ctx.body = formatResponse(null, {
        success: false,
        error: "File name is required",
        statusCode: 400,
      });
      return;
    }

    // Delete file
    await fileService.deleteFile(fileName);

    // Return success response
    ctx.body = formatResponse(null, {
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    if (error.message === "File not found") {
      ctx.status = 404;
      ctx.body = formatResponse(null, {
        success: false,
        error: "File not found",
        statusCode: 404,
      });
    } else {
      ctx.app.emit("error", error, ctx);
    }
  }
}

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  getFile,
  getSignedFileUrl,
  deleteFile,
};
