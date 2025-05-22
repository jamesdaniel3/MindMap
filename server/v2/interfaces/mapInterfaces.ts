import { DBNodeModel, LoadedNodeModel } from "./nodeInterfaces";
export interface DBMapModel {
  id: number;
  creator_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface AllMapInfo extends DBMapModel {
  nodes: DBNodeModel[] | LoadedNodeModel[];
}

export interface MapCreationRequest {
  creator_id: string;
  name: string;
}

export interface MapRetrievalRequest {
  mapId: number;
}

export interface UserMapRetrievalRequest {
  userId: string;
}

export interface AllMapInfoRetrievalRequest {
  mapId: number;
  userId: string;
}

export type DBMapList = DBMapModel[];
