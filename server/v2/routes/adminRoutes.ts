import Router from "koa-router";
import { dbMigrations, dbRollbacks } from "../controllers/adminController";

const router = new Router({
  prefix: "/admin",
});

router.get("/migrate", dbMigrations);
router.get("/rollback", dbRollbacks);

export default router;
