import Router from "koa-router";
import {
  allMaps,
  mapCreator,
  mapLoader,
  allUserMaps,
} from "../controllers/mapController";

const router = new Router({
  prefix: "/maps",
});

router.get("/find-all", allMaps);
router.get("/user-find-all", allUserMaps);
router.post("/create-map", mapCreator);
router.post("/load-map", mapLoader);

export default router;
