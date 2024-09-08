'use client'
import React, { startTransition, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {z} from 'zod'
import {
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import {signInFormSchema} from './utils'
import { Button } from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"
import { signIn } from '@/lib/actions/auth.actions'
import { AppFormInput } from '../app-ui/AppFormInput'
import { useRouter } from 'next/navigation'
import { useProgress } from 'react-transition-progress'
 

export const SignInForm = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const startProgress = useProgress()
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
    setLoading(true)
    startTransition(async() => {
      startProgress()
      const user = await signIn(data)
      if (user) {
        router.push('/dashboard')
      } else {
        setError(true)
        setLoading(false)
      }
    })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <AppFormInput control={form.control} name="email" label="Email" placeholder="Your email address" type="email"/>
        <AppFormInput control={form.control} name="password" label="Password" placeholder="Your password" type="password"/>
        <Button type="submit" disabled={loading}>
          {
            loading ? 'Loading' :
            'Continue'
          }
        </Button>
        {
          error ? (
            <div className="flex flex-row gap-4 items-start">
              <ExclamationCircleIcon className="w-6 text-red-1"/>
              <p className="text-red-1 text-sm">Invalid credentials. Please check email and password.</p>
            </div>
          ) : null
        }
      </form>
    </Form>
  )
}
