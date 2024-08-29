'use server'
import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../server/appwrite"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_KEY } from "../utils";
import { createDwollaCustomer } from "../server/dwolla";
import { getUserByAuthUserId, getUserIdFromAuthUserId } from "./users.actions";

/**
 * 
 * creates user Auth object 
 * creates Dwolla customer
 * creates user doc in the users Collection
 * 
 */
export async function signUpWithEmail({password, email, firstName, lastName, ...user}) {
  let redirectPath: string = ''
  try {
    const { account, database } = await createAdminClient()
    const newUser = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`)
    if (!newUser) throw new Error('1. [Auth] failed to create user') 
    const dwollaCustomerUrl = await createDwollaCustomer({firstName, lastName, email, ...user, type: 'personal'} as NewDwollaCustomerParams)
    if (!dwollaCustomerUrl) throw new Error('2. [signup] failed to create a dwolla customer with error ')
    const dwollaCustomerId = dwollaCustomerUrl.split('/').pop()
    /*
     we have auth user and dwolla user, so let's create a user document in our DB
     */
    const userId = ID.unique();
    const newUserDoc = await database.createDocument(
      process.env.NEXT_APPWRITE_DATABASE_ID!,
      process.env.NEXT_APPWRITE_USERS_COLLECTION_ID!,
      userId,
      {
        firstName,
        lastName,
        email,
        authId: newUser.$id,
        dwollaCustomerURL: dwollaCustomerUrl,
        dwollaCustomerId: dwollaCustomerId
      }
    )
    // create a session to log in the user
    const session = await account.createEmailPasswordSession(email, password)
  
    cookies().set(SESSION_KEY, session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true
    })
    redirectPath = `/link-banks?userId=${newUserDoc.$id}`
  } catch (err) {
    console.error('[Sign Up] action failed with error ', err)
    redirectPath = '/'
  } finally {
    redirect(redirectPath)
  }
}

export async function signIn({email, password}:{email: string, password: string}) {
  let redirectPath: string = '/dashboard'
  try {
    const {account} = await createAdminClient()
    const session = await account.createEmailPasswordSession(email, password)
    cookies().set(SESSION_KEY, session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true
    })
    const userId = session.$id
    const userDoc = await getUserByAuthUserId(userId)
    return userDoc;
    // fetch user doc here
  } catch (err) {
    console.error('[sign in] failed with error', err)
    redirectPath = '/'
  } finally {
    redirect(redirectPath)
  }
}

export async function signOut() {
  try {
    const { account } = await createAdminClient()
    cookies().delete(SESSION_KEY)
    await account.deleteSession(SESSION_KEY)
  } catch (err) {
    console.error(err)
  } finally {
    redirect('/sign-up')
  }
}

export async function getSignedInUser() {
  try {
    const {account} = await createSessionClient()
    const authUser = await account.get();
    const userDoc = await getUserByAuthUserId(authUser.$id)
    return userDoc;
  } catch (err) {
    console.error(err)
    return null;
  }
}