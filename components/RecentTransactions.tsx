import React from 'react'
import Link from 'next/link'
import TransactionsTable from './TransactionsTable'
import { columns } from './TransactionsTableColumns'
import { Card, CardTitle, CardContent, CardHeader } from './ui/card'
import { Account, Transaction } from '@/types'

const RecentTransactions = ({accounts, transactions}: {
  accounts: Account[],
  transactions: Transaction[]
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>
          Recent Transactions
        </CardTitle>
        <Link href="/transaction-history">
          <span className="hovered-text">View More</span>
        </Link>
      </CardHeader>
      <CardContent>
        <TransactionsTable data={transactions} columns={columns}/>
      </CardContent>
    </Card>
  )
}

export default RecentTransactions