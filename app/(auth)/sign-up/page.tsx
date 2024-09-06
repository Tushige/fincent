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

const SignUpPage = () => {
  return (
    <>
      <AppNavBar isSignedin={false} className="gradient-background-2"/>
      <section className=" bg-gradient-to-b from-black to-[#FF204E] w-full md:h-screen flex justify-center items-center">
        <Card className="w-[600px]">
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>
              Be sure to enter your legal name as it appears on your government-issued ID.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignUpForm />
          </CardContent>
          <CardFooter className="flex justify-between">
            <CardDescription>
              Already have an account? <Link href="/sign-in">Sign In</Link>
            </CardDescription>
          </CardFooter>
        </Card>
      </section>
    </>
  )
}
export default SignUpPage
