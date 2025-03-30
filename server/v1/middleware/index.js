// middleware/index.js
const errorHandler = require("./errorHandler");
const fileUploader = require("./fileUploader");

module.exports = {
  errorHandler,
  fileUploader,
  // Export other middleware here
};
