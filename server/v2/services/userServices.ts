// services/userServices.ts
import db from "../db/db";
import {
  User,
  UserDbModel,
  UserCreateParams,
} from "../interfaces/userInterfaces";

export const findOrCreate = async ({
  googleUserId,
  displayName,
  email,
  photo_url,
}: UserCreateParams): Promise<User> => {
  try {
    // Use Knex query builder
    const existingUser = await db("users")
      .where({ google_user_id: googleUserId })
      .first();

    if (existingUser) {
      // User exists, return it
      return formatUser(existingUser);
    }

    // User doesn't exist, create a new one
    const now = new Date();

    const [newUser] = await db("users")
      .insert({
        google_user_id: googleUserId,
        display_name: displayName,
        email: email,
        photo_url: photo_url || null,
        created_at: now,
        updated_at: now,
      })
      .returning("*");

    return formatUser(newUser);
  } catch (error) {
    console.error("Error in findOrCreate service:", error);
    throw error;
  }
};

// Helper function to format user data from DB to API response
function formatUser(userData: UserDbModel): User {
  return {
    googleUserId: userData.google_user_id,
    displayName: userData.display_name,
    email: userData.email,
    photo_url: userData.photo_url || null,
    createdAt: userData.created_at.toISOString(),
    updatedAt: userData.updated_at.toISOString(),
  };
}
