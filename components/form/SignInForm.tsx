'use client'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {z} from 'zod'
import {signInFormSchema} from './utils'
import { Button } from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"
import { signIn } from '@/lib/actions/auth.actions'
import { AppFormInput } from '../app-ui/AppFormInput'
import { useRouter } from 'next/navigation'
 

export const SignInForm = () => {
  const router = useRouter();
  const formSchema = signInFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    },
  })
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await signIn(data)
    router.push('/dashboard')
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <AppFormInput control={form.control} name="email" label="Email" placeholder="Your email address" type="email"/>
        <AppFormInput control={form.control} name="password" label="Password" placeholder="Your password" type="password"/>
        <Button type="submit">Continue</Button>
      </form>
    </Form>
  )
}
