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
import { GradientText } from '@/components/app-ui/GradientText'
import AuthCard from '../AuthCard'
import { AppNavBar } from '@/components/app-ui/AppNavBar'

const SignInPage = () => {
  return (
    <div className="w-full h-screen">
      <AppNavBar isSignedin={false} className="bg-background "/>
      <section className="w-full mt-12 lg:mt-16 flex justify-center items-center">
        <AuthCard>
          <>
            <CardHeader className="relative">
              <CardTitle>Sign in to <GradientText text="Fincent"/></CardTitle>
            </CardHeader>
            <CardContent>
              <SignInForm />
            </CardContent>
            <CardFooter className="flex justify-between">
              <CardDescription>
                Don&apos;t have an account? <Link href="/sign-up" className="font-medium underline hover:text-foreground">Sign Up</Link>
              </CardDescription>
            </CardFooter>
          </>
        </AuthCard>
      </section>
    </div>
  )
}

export default SignInPage
