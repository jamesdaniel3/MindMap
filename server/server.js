// server.js
require("dotenv").config();
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const { errorHandler } = require("./middleware");
const routes = require("./routes");
const config = require("./config");
const { koaBody } = require("koa-body");

// Initialize Firebase
require("./config/firebase");

// Initialize the app
const app = new Koa();
const PORT = process.env.PORT || 3001;

// Global middleware
app.use(cors());
app.use(bodyParser());
app.use(errorHandler);

app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 200 * 1024 * 1024
  }
}));

// Apply routes
app.use(routes.routes());
app.use(routes.allowedMethods());

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
