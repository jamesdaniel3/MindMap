export interface DBMapModel {
  id: number;
  creator_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface MapCreationRequest {
  creator_id: string;
  name: string;
}

export type DBMapList = DBMapModel[];
