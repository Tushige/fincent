'use server'
import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "./server/appwrite"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_KEY } from "./utils";

export async function signUpWithEmail({email, password, firstName, lastName}) {
  try {
    const { account } = await createAdminClient()
    const newUser = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`)
    const session = await account.createEmailPasswordSession(email, password)
  
    cookies().set(SESSION_KEY, session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true
    })
    redirect('/dashboard')
  } catch (err) {
    console.error('[Sign Up] action failed with error ', err)
    throw err;
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
    redirect('/dashboard')
  } catch (err) {
    console.error('[sign in] failed with error', err)
    throw err
  }
  
}

export async function signOut() {
  try {
    const {account} = await createSessionClient()
    cookies().delete(SESSION_KEY)
    await account.deleteSession('current')
    redirect('/sign-in')
  } catch (err) {
    console.error('[SignIn Action] failed with error ', err)
    throw err;
  }
}