import { getSignedInUser } from "@/lib/actions/auth.actions";
import {redirect} from 'next/navigation'

export default async function Home() {
  const user = await getSignedInUser()
  if (!user) redirect('/sign-in')
  redirect('/dashboard')
}