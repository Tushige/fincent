'use server'
import { ID, Query } from "node-appwrite";
import {createAdminClient} from '@/lib/server/appwrite'

const {
  NEXT_APPWRITE_DATABASE_ID,
  NEXT_APPWRITE_BANKS_COLLECTION_ID
} = process.env;

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceURL,
  shareableId
}: createBankAccountProps) => {
  try {
    // create a bank account as a document in our database
    const {database} = await createAdminClient()
    const bankAccount = await database.createDocument(
      NEXT_APPWRITE_DATABASE_ID!,
      NEXT_APPWRITE_BANKS_COLLECTION_ID!,
      ID.unique(), {
        bankId,
        accountId,
        accessToken,
        fundingSourceURL,
        shareableId,
        userId
      }
    )
    return bankAccount;
  } catch (err) {
    console.error(err)
    throw err
  }
}

export const getBanksByUserId = async (userId: string) => {
  try {
    const {database} = await createAdminClient()
    const bankDocs = await database.listDocuments(
      NEXT_APPWRITE_DATABASE_ID!,
      NEXT_APPWRITE_BANKS_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    ) 
    return bankDocs.documents
  } catch (err) {
    console.error('getBanksByUserId failed with error ', err)
  }
}
export const getBankById = async (bankId: string) => {
  try {
    const {database} = await createAdminClient() 
    const bankDoc = await database.getDocument(
      NEXT_APPWRITE_DATABASE_ID!,
      NEXT_APPWRITE_BANKS_COLLECTION_ID!,
      bankId
    )
    return bankDoc
  } catch (err) {
    console.error(err)
  }
}