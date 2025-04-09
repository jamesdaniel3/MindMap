import { Context } from "koa";
import { NodeAndEdgeCreationRequest } from "../interfaces/nodeInterfaces";
import { addNodeEdges, createNode } from "../services/nodeServices";

export const createNodeAndEdges = async (ctx: Context): Promise<void> => {
  try {
    const { mapID, name, nodePrereqs, nodePostreqs } = ctx.request
      .body as NodeAndEdgeCreationRequest;

    // create node
    const newNodeInfo = await createNode({ mapID, name });

    // create edges
    for (const prereqId of nodePrereqs) {
      await addNodeEdges({
        currentNodeId: newNodeInfo.id,
        otherNodeId: prereqId,
        otherIsPrereq: true,
      });
    }
    for (const postreqId of nodePostreqs) {
      await addNodeEdges({
        currentNodeId: newNodeInfo.id,
        otherNodeId: postreqId,
        otherIsPrereq: false,
      });
    }

    // add content?

    ctx.status = 200;
    ctx.body = { newNodeInfo: newNodeInfo };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
    console.error("There was an error when creating your node", err);
  }
};
