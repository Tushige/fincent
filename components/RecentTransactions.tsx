import React from 'react'
import TransactionsTable from './TransactionsTable'
import { columns } from './TransactionsTableColumns'
import { Card, CardTitle, CardContent, CardHeader } from './ui/card'

const RecentTransactions = ({accounts, transactions}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row">
        <CardTitle>
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TransactionsTable data={transactions} columns={columns}/>
      </CardContent>
    </Card>
  )
}

export default RecentTransactions