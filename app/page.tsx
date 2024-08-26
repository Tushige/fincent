import { getLoggedInUser } from "@/lib/server/appwrite";
import {redirect} from 'next/navigation'

export default async function Home() {
  const user = await getLoggedInUser()
  if (!user) redirect('/sign-in')
  redirect('/dashboard')
}