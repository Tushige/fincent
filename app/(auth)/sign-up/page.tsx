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

const SignUpPage = () => {
  return (
    <section className="w-full h-screen flex justify-center items-center">
      <Card className="w-[500px]">
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
            For information on how we use your data see. US Disclosures
          </CardDescription>
        </CardFooter>
      </Card>
    </section>
  )
}

export default SignUpPage
