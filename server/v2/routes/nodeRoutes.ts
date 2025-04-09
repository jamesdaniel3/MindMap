import Router from "koa-router";
import { createNodeAndEdges } from "../controllers/nodeController";

const router = new Router({
  prefix: "/nodes",
});

router.post("/add-node", createNodeAndEdges);

export default router;
