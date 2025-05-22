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
router.get("/user-find-all/:userId", allUserMaps);
router.post("/create-map", mapCreator);
router.post("/load-map", mapLoader); // this should really be rewritten as a get request with a parameter

export default router;
