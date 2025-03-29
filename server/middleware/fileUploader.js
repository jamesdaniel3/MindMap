// middleware/fileUpload.js
const multer = require("multer");

// Configure in-memory storage
const storage = multer.memoryStorage();

// Create file filter to validate uploads
const fileFilter = (req, file, cb) => {
  // Accept images, PDFs, and common file types
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/svg+xml",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    // Accept the file
    cb(null, true);
  } else {
    // Reject the file
    cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
  }
};

// Configure multer with size limits and file filters
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
    files: 5, // Maximum of 5 files at once
  },
  fileFilter,
});

/**
 * Convert multer middleware to work with Koa
 * @param {Function} multerMiddleware - Multer middleware function
 * @returns {Function} - Koa middleware function
 */
function koaMulter(multerMiddleware) {
  return async (ctx, next) => {
    const multerPromise = new Promise((resolve, reject) => {
      multerMiddleware(ctx.req, ctx.res, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    try {
      await multerPromise;
      // Make file(s) available in ctx.request
      ctx.request.file = ctx.req.file;
      ctx.request.files = ctx.req.files;
      await next();
    } catch (error) {
      ctx.throw(400, error.message);
    }
  };
}

// Export middleware for various upload scenarios
module.exports = {
  // For a single file upload
  single: (fieldName) => koaMulter(upload.single(fieldName)),

  // For multiple files in one field
  array: (fieldName, maxCount) => koaMulter(upload.array(fieldName, maxCount)),

  // For multiple files in different fields
  fields: (fields) => koaMulter(upload.fields(fields)),

  // For any files, up to the configured limits
  any: () => koaMulter(upload.any()),
};
