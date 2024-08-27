'use client'
import { useEffect } from "react"
import { signOut } from "@/lib/actions/auth.actions"

export default async function Page() {
  useEffect(() => {
    async function out() {
      await signOut();
    }
    out();
  }, [])
  return (
    <></>
  )
}