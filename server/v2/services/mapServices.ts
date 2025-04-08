import db from "../db/db";
import {
  DBMapList,
  MapCreationRequest,
  DBMapModel,
} from "../interfaces/mapInterfaces";

export const getAllMaps = async (): Promise<DBMapList> => {
  const mapsData = await db("maps");

  return mapsData;
};

export const createMap = async ({
  creator_id,
  name,
}: MapCreationRequest): Promise<DBMapModel> => {
  const [newMap] = await db("maps")
    .insert({
      creator_id: creator_id,
      name: name,
    })
    .returning("*");

  return newMap;
};
