import db from "../db/db";
import {
  DBAssignmentList,
  NodeAssignmentsRequest,
} from "../interfaces/assignmentInterfaces";

export const getAssignmentsForNode = async ({
  nodeId,
}: NodeAssignmentsRequest): Promise<DBAssignmentList> => {
  const nodeAssignments = await db("assignments").where({ node_id: nodeId });

  return nodeAssignments;
};
