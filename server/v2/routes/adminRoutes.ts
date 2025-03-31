import Router from "koa-router";
import { dbMigrations, dbRollbacks } from "../controllers/adminController";

const router = new Router({
  prefix: "/admin",
});

router.get("/migrate/:api_key", dbMigrations);
router.get("/rollback/:api_key", dbRollbacks);

export default router;
