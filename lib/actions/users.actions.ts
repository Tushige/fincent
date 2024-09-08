import { Query } from "node-appwrite";
import { createAdminClient } from "../server/appwrite"
import { User } from "@/types";

export const getUserByAuthUserId = async (id: string): Promise<User | null> => {
  try {
    const { database } = await createAdminClient();
    const userDoc = await database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_ID!,
      process.env.NEXT_APPWRITE_USERS_COLLECTION_ID!,
      [
        Query.equal('authId', [id]),
        Query.limit(1)
      ]
    )
    return userDoc.documents[0]
  } catch (err) {
    console.error(err)
    return null;
  }
}

export const getUserIdFromAuthUserId = async (id: string) => {
  try {
    const { database } = await createAdminClient();
    const userDoc = await database.listDocuments(
      process.env.NEXT_APPWRITE_DATABASE_ID!,
      process.env.NEXT_APPWRITE_USERS_COLLECTION_ID!,
      [
        Query.equal('authId', [id]),
        Query.select(['$id']),
        Query.limit(1)
      ]
    )
    return userDoc.documents[0]
  } catch (err) {
    console.error(err)
  }
}