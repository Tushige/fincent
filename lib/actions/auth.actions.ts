'use server'
import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../server/appwrite"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_KEY } from "../utils";
import { createDwollaCustomer } from "../server/dwolla";
import { getUserByAuthUserId, getUserIdFromAuthUserId } from "./users.actions";
import { createIncomePublicToken, createPlaidUserToken } from "./plaid/plaid.actions";
import { User } from "@/types";

/**
 * 
 * creates user Auth object 
 * creates Dwolla customer
 * creates user doc in the users Collection
 * 
 */
export async function signUpWithEmail({password, email, firstName, lastName, ...user}) {
  try {
    const { account, database } = await createAdminClient()
    const newUser = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`)
    if (!newUser) throw new Error('1. [Auth] failed to create user') 
    const dwollaCustomerUrl = await createDwollaCustomer({firstName, lastName, email, ...user, type: 'personal'} as NewDwollaCustomerParams)
    if (!dwollaCustomerUrl) throw new Error('2. [signup] failed to create a dwolla customer with error ')
    const dwollaCustomerId = dwollaCustomerUrl.split('/').pop()

    const userToken = await createPlaidUserToken(newUser.$id)
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
        address1: user.address1,
        city: user.city,
        state: user.state,
        postalCode: user.postalCode,
        ssn: user.ssn,
        dateOfBirth: user.dateOfBirth,
        dwollaCustomerURL: dwollaCustomerUrl,
        dwollaCustomerId: dwollaCustomerId,
        userToken
      }
    )
    // enable our user_token to use the income API
    await createIncomePublicToken(userToken)
    // create a session to log in the user
    const session = await account.createEmailPasswordSession(email, password)
  
    cookies().set(SESSION_KEY, session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true
    })
    return newUserDoc;
  } catch (err) {
    console.error('[Sign Up] action failed with error ', err)
    return null;
  }
}

export async function signIn({email, password}:{email: string, password: string}) {
  try {
    const {account} = await createAdminClient()
    const session = await account.createEmailPasswordSession(email, password)
    cookies().set(SESSION_KEY, session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true
    })
    const userDoc = await getUserByAuthUserId(session.userId)
    return userDoc;
  } catch (err) {
    console.error('[sign in] failed with error', err)
    return null;
  }
}

export async function signOut() {
  try {
    const { account } = await createAdminClient()
    cookies().delete(SESSION_KEY)
    const result = await account.deleteSession('current')
  } catch (err) {
    console.error(err)
  } finally {
    redirect('/')
  }
}

export async function getSignedInUser(): Promise<User> {
  try {
    const {account} = await createSessionClient()
    const authUser = await account.get();
    const userDoc = await getUserByAuthUserId(authUser.$id)
    return userDoc;
  } catch (err) {
    return null;
  }
}