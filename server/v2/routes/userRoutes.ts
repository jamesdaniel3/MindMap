import Router from "koa-router";
import { userFindOrCreate } from "../controllers/userController";

const router = new Router({
  prefix: "/users",
});

router.post("/find-or-create", userFindOrCreate);

export default router;
