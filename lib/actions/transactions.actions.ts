'use server'
import { ID, Query } from "node-appwrite";
import {createAdminClient} from '@/lib/server/appwrite'

const {
  NEXT_APPWRITE_DATABASE_ID,
  NEXT_APPWRITE_TRANSACTIONS_COLLECTION_ID
} = process.env;

const PENDING = 'pending'
const DEFAULT_NAME = 'John Doe'

const createTransaction = async ({
  memo,
  amount,
  email,
  sourceBank,
  destinationBank
}: createTransactionProps) => {
  try {
    const {database} = await createAdminClient()
    const receiverId = destinationBank.userId.$id
    const senderId = sourceBank.userId.$id
    const senderBankId = sourceBank.$id
    const receiverBankId = destinationBank.$id
    const data = {
      name: DEFAULT_NAME,
      memo,
      channel: 'online',
      category: 'TRANSFER_OUT',
      amount,
      email,
      senderId,
      receiverId,
      senderBankId,
      receiverBankId,
      status: PENDING
    }
    const transactionDoc = await database.createDocument(
      NEXT_APPWRITE_DATABASE_ID!,
      NEXT_APPWRITE_TRANSACTIONS_COLLECTION_ID!,
      ID.unique(),
      data
    )
    return transactionDoc;
  } catch (err) {
    console.error('failed to create transaction document with error: ', err)
  }
}


const getTransferTransactionsByBankId = async (bankId: string, offset: number = 0, limit: number = 10) => {
  try {
    const {database} = await createAdminClient()
    const sendTransfers = await database.listDocuments(
      NEXT_APPWRITE_DATABASE_ID!,
      NEXT_APPWRITE_TRANSACTIONS_COLLECTION_ID!,
      [
        Query.limit(limit),
        Query.offset(offset),
        Query.equal('senderBankId', [bankId])
      ]
    )
    const receiverTransfers = await database.listDocuments(
      NEXT_APPWRITE_DATABASE_ID!,
      NEXT_APPWRITE_TRANSACTIONS_COLLECTION_ID!,
      [
        Query.limit(limit),
        Query.offset(offset),
        Query.equal('receiverBankId', [bankId])
      ]
    )
    const documents = [...sendTransfers.documents, ...receiverTransfers.documents]
    const transactions = documents.map(transaction => {
      const isOutgoing = transaction.senderBankId === bankId
      const createdAt = new Date(transaction.$createdAt)
      const date = `${createdAt.getFullYear()}-${createdAt.getMonth()+1}-${createdAt.getDate()}`
      return {
        id: transaction.$id,
        name: transaction.name,
        memo: transaction.memo,
        amount: isOutgoing ? -transaction.amount : transaction.amount,
        date,
        payment_channel: transaction.channel,
        category: transaction.category,
        status: transaction.status,
        pending: transaction.status === PENDING
      }
    })
    
    return transactions;
  } catch (err) {
    console.error('Failed fetching outgoing transactions', err)
  }
}


export {
  createTransaction,
  getTransferTransactionsByBankId
}