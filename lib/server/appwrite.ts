'use server'
import {Client, Account} from 'node-appwrite'
import {cookies} from 'next/headers'
import { SESSION_KEY } from '../utils';

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

    const session = cookies().get(SESSION_KEY)
    if (!session || !session.value) {
      throw new Error('No Session')
    }
    client.setSession(session.value)

    return {
      get account() {
        return new Account(client)
      }
    }
}

export async function createAdminClient() {
  const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
  };
}

export async function getLoggedInUser() {
  try {
    const {account} = await createSessionClient()
    return await account.get();
  } catch (error) {
    return null;
  }
}