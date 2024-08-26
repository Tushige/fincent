'use client'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {z} from 'zod'
import {signUpFormSchema} from './utils'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { AppFormInput } from '../app-ui/AppFormInput'
import {signUpWithEmail} from '@/lib/actions'

export const SignUpForm = () => {
  const formSchema = signUpFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirm: '',
      userAgreement: ''
    },
  })
  const {control, handleSubmit, formState} = form;
  
  const onSubmit= async (data: z.infer<typeof formSchema>) => {
    await signUpWithEmail(data)
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex justify-between">
          <AppFormInput control={control} name="firstName" label="First Name" placeholder="Legal First Name"/>
          <AppFormInput control={control} name="lastName" label="Last Name" placeholder="Legal Last Name"/>
        </div>
        <AppFormInput control={control.control} name="email" label="Email" placeholder="Email" type="email"/>
        <AppFormInput control={control.control} name="password" label="Password" placeholder="Minimum 4 characters" type="password"/>
        <AppFormInput control={control.control} name="confirm" label="Confirm Password" placeholder="Minimum 4 characters" type="password"/>
        <FormField
          control={control.control}
          name="userAgreement"
          render={({field}) => (
            <FormItem className="flex justify-between items-center gap-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange}
              />
              </FormControl>
              <div className="leading-none mt-0">
                <FormLabel>
                By registering, you agree that you have read, understand, and acknowledge our Privacy Policy and accept our General Terms of Use.
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create Account</Button>
      </form>
    </Form>
  )
}
