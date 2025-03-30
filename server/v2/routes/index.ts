import Router from "koa-router";
import healthRoutes from "./healthRoutes";

const router = new Router({
  prefix: "/api/v2",
});

// Register all route modules here
router.use(healthRoutes.routes(), healthRoutes.allowedMethods());

export default router;
