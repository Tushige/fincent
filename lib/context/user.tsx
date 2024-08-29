'use client'
import {z} from 'zod'
import { createContext, useContext, useEffect, useState } from "react";
import { signIn as signInAction, signUpWithEmail, signOut as signOutAction, getSignedInUser } from "../actions/auth.actions";
import { signInFormSchema, signUpFormSchema } from "@/components/form/utils";
import { useRouter } from "next/router";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider(props) {
  const router = useRouter()
  const [user, setUser] = useState(null);
  const _signInFormSchema = signInFormSchema();
  const _signUpFormSchema = signUpFormSchema();

  async function signIn(data:  z.infer<typeof _signInFormSchema>) {
    const userDoc = await signInAction(data)
    setUser(userDoc);
    router.push('/dashboard')
  }

  async function signOut() {
    await signOutAction();
    setUser(null);
  }

  async function signUp(data: z.infer<typeof _signUpFormSchema>) {
    const userDoc = await signUpWithEmail(data)
    setUser(userDoc)
    router.push('/link-bank')
  }

  async function init() {
    try {
      const userDoc = await getSignedInUser();
      setUser(userDoc);
    } catch (err) {
      setUser(null);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <UserContext.Provider value={{ current: user, signIn, signOut, signUp }}>
      {props.children}
    </UserContext.Provider>
  );
}