// routes/fileRoutes.js
const Router = require("@koa/router");
const fileController = require("../controllers/fileController");
const { fileUploader } = require("../middleware");

const router = new Router({
  prefix: "/files",
});

// Upload a file
router.post("/upload", fileUploader.single("file"), fileController.uploadFile);

// Upload multiple files
router.post(
  "/upload-multiple",
  fileUploader.array("files", 5),
  fileController.uploadMultipleFiles
);

// Get file by name
router.get("/:fileName", fileController.getFile);

// Get a temporary signed URL for a file
router.get("/signed/:fileName", fileController.getSignedFileUrl);

// Delete a file
router.delete("/:fileName", fileController.deleteFile);

module.exports = router;
