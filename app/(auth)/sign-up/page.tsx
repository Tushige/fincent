import React from 'react'
import { SignUpForm } from '@/components/form/SignUpForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AppNavBar } from '@/components/app-ui/AppNavBar'
import Link from 'next/link'
import AuthCard from '../AuthCard'

const SignUpPage = () => {
  return (
    <div className="w-full">
      <AppNavBar isSignedin={false} className="bg-background"/>
      <section className="w-full mt-4 lg:mt-12 flex justify-center items-center">
        <AuthCard className="w-[600px] container">
          <>
            <CardHeader className="px-0">
              <CardTitle>Create an Account</CardTitle>
              <CardDescription>
                Be sure to enter your legal name as it appears on your government-issued ID.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <SignUpForm />
            </CardContent>
            <CardFooter className="flex justify-between px-0 mt-4">
              <CardDescription>
                Already have an account? <Link href="/sign-in" className="underline">Sign In</Link>
              </CardDescription>
            </CardFooter>
          </>
        </AuthCard>
      </section>
    </div>
  )
}
export default SignUpPage
