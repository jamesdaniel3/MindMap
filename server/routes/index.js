// routes/index.js
const Router = require("@koa/router");
const mapRoutes = require("./mapRoutes");

const router = new Router({
  prefix: "/api",
});

// Register all route modules here
router.use(mapRoutes.routes(), mapRoutes.allowedMethods());

// Health check endpoint
router.get("/health", (ctx) => {
  ctx.body = { status: "ok", timestamp: new Date() };
});

module.exports = router;
