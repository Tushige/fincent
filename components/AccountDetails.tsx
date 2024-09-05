import React from 'react'
import { getAccount } from '@/lib/actions/plaid/plaid.actions'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn, formatUSD } from '@/lib/utils'

const AccountDetails = ({account, className}) => {
  return (
    <Card className={cn("w-full page-enter bg-background flex flex-row justify-between p-4 gradient-background-2", className)}>
      <div className="flex flex-col gap-2 lg:gap-4">
        <h3 className="text-lg lg:text-2xl font-black">{account.name}</h3>
        <p className="text-sm lg:text-medium">{account.officialName}</p>
      </div>

      <div className="flex flex-col gap-2 p-4 lg:gap-4 border-border bg-slate-400 rounded-xl gradient-background">
        <span>Current Balance</span>
        <span className="font-black text-medium lg:text-lg">{formatUSD(account?.currentBalance)}</span>
      </div>
    </Card>
  )
}

export default AccountDetails