import Router from "koa-router";
import { allMaps, mapCreator, mapLoader } from "../controllers/mapController";

const router = new Router({
  prefix: "/maps",
});

router.get("/find-all", allMaps);
router.post("/create-map", mapCreator);
router.post("/load-map", mapLoader);

export default router;
