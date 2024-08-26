import React from 'react'
import { SignInForm } from '@/components/form/SignInForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link'

const SignInPage = () => {
  return (
    <section className="w-full h-screen flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign in to Fincent</CardTitle>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
        <CardFooter className="flex justify-between">
          <CardDescription>
            Don't have an account? <Link href="/sign-up" className="font-medium underline">Sign Up</Link>
          </CardDescription>
        </CardFooter>
      </Card>
    </section>
  )
}

export default SignInPage
