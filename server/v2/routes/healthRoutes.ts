import Router from "koa-router";
import { dbHealthCheck } from "../controllers/healthController";

const router = new Router({
  prefix: "/health",
});

router.get("/db", dbHealthCheck);

export default router;
