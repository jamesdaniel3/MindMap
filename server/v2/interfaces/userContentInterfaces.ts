export interface DBUserContentModel {
  id: number;
  completed: boolean;
  assignment_id: number;
  user_id: string;
  content: string;
}

export interface GetUserContentRequest {
  googleUserId: string;
  assignmentId: number;
}
