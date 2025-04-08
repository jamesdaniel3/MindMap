import Router from "koa-router";
import { allMaps, mapCreater } from "../controllers/mapController";

const router = new Router({
  prefix: "/maps",
});

router.get("/find-all", allMaps);
router.post("/create-map", mapCreater);

export default router;
