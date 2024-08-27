import { createAdminClient } from "../server/appwrite"

export const getUserById = async (id: string) => {
  try {
    const { database } = await createAdminClient();
    console.log('[getUserById] were getting doc by id ', id)
    const userDoc = await database.getDocument(
      process.env.NEXT_APPWRITE_DATABASE_ID!,
      process.env.NEXT_APPWRITE_USERS_COLLECTION_ID!,
      id
    )
    console.log('[Users Action] got user back')
    console.log(userDoc)
    return userDoc
  } catch (err) {
    console.error(err)
  }
}