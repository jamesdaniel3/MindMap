import Router from "koa-router";
import healthRoutes from "./healthRoutes";
import adminRoutes from "./adminRoutes";
import userRoutes from "./userRoutes";

const router = new Router({
  prefix: "/api/v2",
});

// Register all route modules here
router.use(healthRoutes.routes(), healthRoutes.allowedMethods());
router.use(adminRoutes.routes(), adminRoutes.allowedMethods());
router.use(userRoutes.routes(), userRoutes.allowedMethods());

export default router;
