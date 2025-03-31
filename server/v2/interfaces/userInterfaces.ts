export interface User {
  googleUserId: string;
  displayName: string;
  email: string;
  photo_url: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserFindOrCreateRequest {
  googleUserId: string;
  displayName: string;
  email: string;
  photo_url?: string;
}
