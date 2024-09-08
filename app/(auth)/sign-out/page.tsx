'use client'
import { useEffect } from "react"
import { signOut } from "@/lib/actions/auth.actions"
import AppLoader from "@/components/app-ui/AppLoader";

export default function Page() {
  useEffect(() => {
    async function out() {
      await signOut();
    }
    out();
  }, [])
  return (
    <AppLoader />
  )
}