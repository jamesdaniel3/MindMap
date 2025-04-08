import db from "../db/db";
import { DBMapList } from "../interfaces/mapInterfaces";

export const getAllMaps = async (): Promise<DBMapList> => {
  const mapsData = await db("maps");

  return mapsData;
};
