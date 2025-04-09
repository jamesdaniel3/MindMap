import db from "../db/db";
import {
  DBUserContentModel,
  GetUserContentRequest,
} from "../interfaces/userContentInterfaces";

export const getUserContentForAssignment = async ({
  assignmentId,
  googleUserId,
}: GetUserContentRequest): Promise<DBUserContentModel> => {
  const [assingmentData] = await db("user_content").where({
    assignment_id: assignmentId,
    user_id: googleUserId,
  });

  return assingmentData;
};
