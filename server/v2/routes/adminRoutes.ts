import Router from "koa-router";
import { dbMigrations } from "../controllers/adminController";

const router = new Router({
  prefix: "/admin",
});

router.get("/migrate", dbMigrations);

export default router;
