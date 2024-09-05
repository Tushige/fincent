'use client'
import React, { useEffect, useState } from 'react'
import TestTransactionTable from '@/components/TestTransactionTable';
import SelectAccount from '@/components/SelectAccount';
import { getTransactionsByBank } from '@/lib/actions/plaid/plaid.actions';
import AccountDetails from '@/components/AccountDetails';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';
import AppTransactionTableContainer from './app-ui/AppTransactionTableContainer';

const TransactionHistoryClientUI = ({
  accounts,
  account,
  bankId
}) => {
  const [loading, setLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [transactions, setTransactions] = useState([])
  const [nextCursor, setnextCursor] = useState(null)
  const [previousCursors, setPreviousCursors] = useState([])
  const [hasMore, setHasMore] = useState(true)

  const fetchTransactions = async (cursor) => {
    setTableLoading(true)
    try {
      const transactions = await getTransactionsByBank(bankId, cursor, 10);
      setTransactions(transactions.transactions)
      setPreviousCursors(prev => cursor ? [...prev, cursor] : [])
      setnextCursor(transactions?.next_cursor)
      setHasMore(transactions?.has_more)
    } catch(err) {
      console.error(err)
    } finally {
      setTableLoading(false)
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchTransactions(null)
  }, [bankId])

  const handleNext = () => {
    fetchTransactions(nextCursor)
  }
  const handlePrev = () =>  {
    if (previousCursors.length > 0) {
      const previousCursor = previousCursors[previousCursors.length - 2]
      fetchTransactions(previousCursor)
      setPreviousCursors(prev => prev.slice(0, -2))
    }
  }

  return (
    <div>
      <div className="flex flex-col justify-between mb-8">
        <SelectAccount
          accounts={accounts}
          setLoading={setLoading}
          className="mb-4 mt-8"
          defaultValue={bankId}
        />
      </div>
      <AppTransactionTableContainer>
        {
          loading ? (
            /**skeleton for the whole table */
            <div className={cn("space-y-2", {'page-enter': loading, 'page-exit': !loading})}>
              <Skeleton className="h-[100px] w-[100%] rounded-xl mb-8" />
              <Skeleton className={cn("h-[300px] w-[100%] rounded-xl")} />
            </div>
          ) : (
            <>
              <AccountDetails account={account} className={cn('mb-8', {'page-enter': !loading, 'page-exit': loading})}/>
              <TestTransactionTable
                className={cn({'page-enter': !loading, 'page-exit': loading})}
                transactions={transactions}
                prevDisabled={previousCursors.length < 1}
                nextDisabled={!hasMore}
                handleNext={handleNext}
                handlePrev={handlePrev}
                loading={tableLoading}
              />
            </>
          )
        }
      </AppTransactionTableContainer>
    </div>
  )
}

export default TransactionHistoryClientUI