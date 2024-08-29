import React from 'react'
import TransactionsTable from './TransactionsTable'
import { columns } from './TransactionsTableColumns'

const RecentTransactions = ({accounts, transactions}) => {
  return (
    <TransactionsTable data={transactions} columns={columns}/>
  )
}

export default RecentTransactions