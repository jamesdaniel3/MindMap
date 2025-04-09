import db from "../db/db";
import {
  NodeCreationRequest,
  DBNodeModel,
  EdgeCreationRequest,
  NodeNeighborList,
  GetNodeNeighborsRequest,
} from "../interfaces/nodeInterfaces";

export const createNode = async ({
  mapID,
  name,
}: NodeCreationRequest): Promise<DBNodeModel> => {
  const [newNode] = await db("nodes")
    .insert({ name: name, map_id: mapID })
    .returning("*");

  return newNode;
};

export const addNodeEdges = async ({
  currentNodeId,
  otherNodeId,
  otherIsPrereq,
}: EdgeCreationRequest): Promise<void> => {
  // check that nodes exist
  const [currentNodeInfo] = await db("nodes").where({ id: currentNodeId });
  const [otherNodeInfo] = await db("nodes").where({ id: otherNodeId });

  if (currentNodeInfo === undefined || otherNodeInfo === undefined) {
    return;
  }

  if (otherIsPrereq) {
    // add prereq and postreq relationships
    await db("node_prereqs").insert({
      current_node_id: currentNodeId,
      prereq_node_id: otherNodeId,
    });
    await db("node_postreqs").insert({
      current_node_id: otherNodeId,
      postreq_node_id: currentNodeId,
    });
  } else {
    // add prereq and postreq relationships in reverse
    await db("node_postreqs").insert({
      current_node_id: currentNodeId,
      postreq_node_id: otherNodeId,
    });
    await db("node_prereqs").insert({
      currentNodeId: otherNodeId,
      prereq_node_id: currentNodeId,
    });
  }
};

export const getNodePrereqs = async ({
  nodeId,
}: GetNodeNeighborsRequest): Promise<NodeNeighborList> => {
  const prereqs = await db("node_prereqs")
    .select("prereq_node_id")
    .where({ current_node_id: nodeId });

  // return a list of the node ids rather than a list of objects
  return prereqs.map((item) => item.prereq_node_id);
};

export const getNodePostreqs = async ({
  nodeId,
}: GetNodeNeighborsRequest): Promise<NodeNeighborList> => {
  const postreqs = await db("node_postreqs")
    .select("postreq_node_id")
    .where({ current_node_id: nodeId });

  // return a list of the node ids rather than a list of objects
  return postreqs.map((item) => item.postreq_node_id);
};
