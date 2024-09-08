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
        <AuthCard className="w-[600px] container py-8">
          <>
            <CardHeader className="px-0">
              <CardTitle>Create an Account</CardTitle>
              <CardDescription className="py-4">
                Already have an account? <Link href="/sign-in" className="underline text-foreground">Sign In</Link>
              </CardDescription>
              <CardDescription>
                Be sure to enter your legal name as it appears on your government-issued ID.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <SignUpForm />
            </CardContent>
          </>
        </AuthCard>
      </section>
    </div>
  )
}
export default SignUpPage
