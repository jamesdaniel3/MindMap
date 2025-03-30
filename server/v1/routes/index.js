// routes/index.js
const Router = require("@koa/router");
const mapRoutes = require("./mapRoutes");
const fileRoutes = require("./fileRoutes");
const userRoutes = require("./userRoutes");

const router = new Router({
  prefix: "/api/v1",
});

// Register all route modules here
router.use(mapRoutes.routes(), mapRoutes.allowedMethods());
router.use(fileRoutes.routes(), fileRoutes.allowedMethods());
router.use(userRoutes.routes(), userRoutes.allowedMethods());

// Health check endpoint
router.get("/health", (ctx) => {
  ctx.body = { status: "ok", timestamp: new Date() };
});

module.exports = router;
