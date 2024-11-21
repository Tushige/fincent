'use client'
import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import {z} from 'zod'
import { NumericFormat } from 'react-number-format';
import { zodResolver } from '@hookform/resolvers/zod';
import { transferFundsFormSchema } from './utils'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { BankDropDown } from './BankDropDown';
import { AppFormInput } from '../app-ui/AppFormInput';
import { Button } from '../ui/button';
import { Textarea } from "@/components/ui/textarea"
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { cn, decryptId } from '@/lib/utils';
import { initiateFundTransfer } from '@/lib/server/dwolla';
import { getBankByAccountId, getBankById } from '@/lib/actions/banks.actions';
import { createTransaction } from '@/lib/actions/transactions.actions';


const SubHeader = ({text}) => {
  return (
    <h2 className="mb-8 w-[100%] border-b-[1px] border-border leading-[0.1] mt-8">
      <span className="bg-background pr-2">{text}</span>
    </h2>
  )
}
const TransferFundsForm = ({accounts}: {
  accounts: Account[]
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const formSchema = transferFundsFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      memo: '',
      amount: '',
      senderBankId: '',
      shareableId: ''
    }
  })
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const destinationAccountId = decryptId(data.shareableId)
      const sourceBank = await getBankById(data.senderBankId)
      const destinationBank = await getBankByAccountId(destinationAccountId)
      const transfer = await initiateFundTransfer({sourceBank, destinationBank, amount: data.amount})

      if (!transfer) {
        throw new Error('[Transfer Funds] failed fund transfer')
      } 
      const transactionDoc = await createTransaction({
        memo: data.memo,
        amount: data.amount,
        email: data.email,
        sourceBank,
        destinationBank
      })
    } catch (err) {
      console.error('[Transfer Funds] failed submitting: ', err)
    } finally {
      form.reset()
      setIsLoading(false)
    }
  }
  return (
    <Form {...form}>
      <form className="" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="">
          <SubHeader text="Enter your bank details" />
          <FormField
            control={form.control}
            name="senderBankId"
            render={({field}) => (
              <FormItem>
                <FormLabel>
                  Select where you want to transfer funds from
                </FormLabel>
                <FormControl>
                  <BankDropDown options={accounts} onChange={field.onChange} defaultValue={field.value} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField 
            control={form.control}
            name="memo"
            render={({field}) => (
              <FormItem className="mt-8">
                <FormLabel>Memo (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="mt-2"
                    placeholder="Include any relevant details or notes about this transfer."
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Separator className="my-6"/>
        <SubHeader text="Enter Your Recipient Details" />
        <AppFormInput className="mt-8" control={form.control} name="email" label="Recipient&apos;s Email" placeholder="Email" type="email"/>
        <AppFormInput className="mt-8 w-full" control={form.control} name="shareableId" label="Bank Code" placeholder="Enter the receiver's Plaid shareable bank id"/>
        <FormField
          control={form.control}
          name="amount"
          render={({ field: {onChange, name, value}}) => {
            return (
              <FormItem className={cn("mt-8 w-full")}>
                <FormLabel>Amount</FormLabel>
                <FormControl className="mt-2">
                  <NumericFormat
                    thousandSeparator
                    prefix="$"
                    customInput={Input}
                    name={name}
                    value={value}
                    // onChange={onChange}
                    onValueChange={(values) => {
                      /**we upate the form value like this because we want to display formatted value but use unformatted value when submitting */
                      const {formattedValue, value} = values
                      onChange(value)
                    }}
                    placeholder="Enter the amount you want to transfer"
                  />
                </FormControl>
              </FormItem>
            )
          }}
        />
        <Button type="submit" className="mt-4 lg:mt-8">
          {isLoading ? (
            <div>loading</div>
          ) : (
            'Transfer Funds'
          )}
        </Button>
      </form>
    </Form>
  )
}

export default TransferFundsForm