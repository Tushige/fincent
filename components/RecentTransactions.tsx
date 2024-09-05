import React from 'react'
import Link from 'next/link'
import TransactionsTable from './TransactionsTable'
import { columns } from './TransactionsTableColumns'
import { Card, CardTitle, CardContent, CardHeader } from './ui/card'

const RecentTransactions = ({accounts, transactions}) => {
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