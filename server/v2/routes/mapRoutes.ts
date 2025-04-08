import Router from "koa-router";
import { allMaps, mapCreator } from "../controllers/mapController";

const router = new Router({
  prefix: "/maps",
});

router.get("/find-all", allMaps);
router.post("/create-map", mapCreator);

export default router;
