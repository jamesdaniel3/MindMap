import Router from "koa-router";
import healthRoutes from "./healthRoutes";
import adminRoutes from "./adminRoutes";

const router = new Router({
  prefix: "/api/v2",
});

// Register all route modules here
router.use(healthRoutes.routes(), healthRoutes.allowedMethods());
router.use(adminRoutes.routes(), adminRoutes.allowedMethods());

export default router;
