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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AppFormInput } from '../app-ui/AppFormInput'
import {signUpWithEmail} from '@/lib/actions/auth.actions'
import { AppDatePicker } from '../app-ui/AppDatepicker'

const STATES = [
  {label: 'Alabama', value: 'AL'},
  {label: 'Alaska', value: 'AK'},
  {label: 'Arizona', value: 'AZ'},
  {label: 'Arkansas', value: 'AR'},
  {label: 'California', value: 'CA'},
  {value: 'CO', label: 'Colorado'},
  {value: 'CT', label: 'Connecticut'},
  {value: 'DE', label: 'Delaware'},
  {value: 'DC', label: 'District Of Columbia'},
  {value: 'FL', label: 'Florida'},
  {value: 'GA', label: 'Georgia'},
  {value: 'HI', label: 'Hawaii'},
  {value: 'ID', label: 'Idaho'},
  {value: 'IL', label: 'Illinois'},
  {value: 'IN', label: 'Indiana'},
  {value: 'IA', label: 'Iowa'},
  {value: 'KS', label: 'Kansas'},
  {value: 'KY', label: 'Kentucky'},
  {value: 'LA', label: 'Louisiana'},
  {value: 'ME', label: 'Maine'},
  {value: 'MD', label: 'Maryland'},
  {value: 'MA', label: 'Massachusetts'},
  {value: 'MI', label: 'Michigan'},
  {value: 'MN', label: 'Minnesota'},
  {value: 'MS', label: 'Mississippi'},
  {value: 'MO', label: 'Missouri'},
  {value: 'MT', label: 'Montana'},
  {value: 'NE', label: 'Nebraska'},
  {value: 'NV', label: 'Nevada'},
  {value: 'NH', label: 'New Hampshire'},
  {value: 'NJ', label: 'New Jersey'},
  {value: 'NM', label: 'New Mexico'},
  {value: 'NY', label: 'New York'},
  {value: 'NC', label: 'North Carolina'},
  {value: 'ND', label: 'North Dakota'},
  {value: 'OH', label: 'Ohio'},
  {value: 'OK', label: 'Oklahoma'},
  {value: 'OR', label: 'Oregon'},
  {value: 'PA', label: 'Pennsylvania'},
  {value: 'RI', label: 'Rhode Island'},
  {value: 'SC', label: 'South Carolina'},
  {value: 'SD', label: 'South Dakota'},
  {value: 'TN', label: 'Tennessee'},
  {value: 'TX', label: 'Texas'},
  {value: 'UT', label: 'Utah'},
  {value: 'VT', label: 'Vermont'},
  {value: 'VA', label: 'Virginia'},
  {value: 'WA', label: 'Washington'},
  {value: 'WV', label: 'West Virginia'},
  {value: 'WI', label: 'Wisconsin'},
  {value: 'WY', label: 'Wyoming'}
]
export const SignUpForm = () => {
  const formSchema = signUpFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      ssn: '',
      email: '',
      password: '',
      confirm: '',
      address1: '',
      city: '',
      state: '',
      postalCode: '',
      userAgreement: ''
    },
  })
  const {control, handleSubmit, formState} = form;
  
  const onSubmit= async (data: z.infer<typeof formSchema>) => {
    await signUpWithEmail(data)
  }


  return (
    <Form {...form}>
      <form className="" onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-2 md:flex md:justify-between md:gap-2">
          <AppFormInput className="w-full" control={control} name="firstName" label="First Name" placeholder="Legal First Name"/>
          <AppFormInput className="mt-8 md:mt-0 w-full" control={control} name="lastName" label="Last Name" placeholder="Legal Last Name"/>
        </div>
        <div className="mt-8 md:flex md:justify-between md:gap-2">
          <AppFormInput className="w-full" control={control} name="dateOfBirth" label="Date of Birth" placeholder="YYYY-MM-DD" />
          <AppFormInput className="mt-8 md:mt-0 w-full" control={control} name="ssn" label="SSN(last 4 digits)" placeholder="Enter the last 4 digits of your ssn"/>
        </div>
        <AppFormInput className="mt-8" control={control} name="email" label="Email" placeholder="Email" type="email"/>
        <AppFormInput className="mt-8" control={control} name="password" label="Password" placeholder="Minimum 8 characters" type="password"/>
        <AppFormInput className="mt-8" control={control} name="confirm" label="Confirm Password" placeholder="Minimum 8 characters" type="password"/>
        <AppFormInput className="mt-8" control={control} name="address1" label="Address" placeholder="Enter your address"/>
        <AppFormInput className="mt-8" control={control} name="city" label="City" placeholder="City"/>
        <div className="mt-8 md:flex md:justify-between md:gap-2">
          <FormField
            control={control}
            name="state"
            render={({ field }) => (
              <FormItem className="w-full" key={field.value}>
                <FormLabel>State</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>States</SelectLabel>
                      {STATES.map(({value, label}) => (
                        <SelectItem value={value}>{label}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <AppFormInput className="mt-8 md:mt-0 w-full" control={control} name="postalCode" label="Postal" placeholder="Postal Code"/>
        </div>
        <FormField
          control={control}
          name="userAgreement"
          render={({field}) => (
            <FormItem className="mt-8 flex justify-between items-center gap-4">
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
        <Button type="submit" className="mt-10">Create Account</Button>
      </form>
    </Form>
  )
}
