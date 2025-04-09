export interface NodeAssignmentsRequest {
  nodeId: number;
}

export interface DBAssignmentModel {
  id: number;
  node_id: number;
  name: string;
  type: number;
  content: string;
}

export type DBAssignmentList = DBAssignmentModel[];
