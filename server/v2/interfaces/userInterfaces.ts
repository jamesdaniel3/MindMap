// Database model - represents data as stored in the database
export interface UserDbModel {
  id?: number;
  google_user_id: string;
  display_name: string;
  email: string;
  photo_url?: string | null;
  created_at: Date;
  updated_at: Date;
}

// API response model - represents data returned to clients
export interface User {
  googleUserId: string;
  displayName: string;
  email: string;
  photo_url: string | null;
  createdAt: string;
  updatedAt: string;
}

// Request DTOs (Data Transfer Objects)
export interface UserFindOrCreateRequest {
  googleUserId: string;
  displayName: string;
  email: string;
  photo_url?: string;
}

// Service function parameters
export interface UserCreateParams {
  googleUserId: string;
  displayName: string;
  email: string;
  photo_url?: string;
}

export interface UserFindParams {
  googleUserId: string;
}

export interface UserFindResponse {
  userExists: boolean;
}
