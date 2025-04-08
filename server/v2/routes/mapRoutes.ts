import Router from "koa-router";
import { allMaps } from "../controllers/mapController";

const router = new Router({
  prefix: "/maps",
});

router.get("/find-all", allMaps);

export default router;
