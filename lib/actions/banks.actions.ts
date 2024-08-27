'use server'
import { ID } from "node-appwrite";
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
    console.log('[Banks] creating a bank document with the following data')
    console.log({
      bankId,
      accountId,
      accessToken,
      fundingSourceURL,
      shareableId,
      userId
    })
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