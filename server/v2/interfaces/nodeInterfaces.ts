export interface NodeCreationRequest {
  mapID: number;
  name: string;
}

export interface DBNodeModel {
  id: number;
  map_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface EdgeCreationRequest {
  currentNodeId: number;
  otherNodeId: number;
  otherIsPrereq: boolean;
}

export interface NodeAndEdgeCreationRequest {
  mapID: number;
  name: string;
  nodePrereqs: number[];
  nodePostreqs: number[];
}
