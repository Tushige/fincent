'use client'
import React from 'react'
import TransactionsTable from './TransactionsTable'
import { columns } from './TransactionsTableColumns'
import { Card, CardContent, CardHeader } from './ui/card'
import { cn } from '@/lib/utils'
import { Skeleton } from './ui/skeleton'
import AppTransactionTableContainer from './app-ui/AppTransactionTableContainer'

const TestTransactionTable = ({
  transactions,
  handleNext,
  handlePrev,
  prevDisabled,
  nextDisabled,
  loading,
  className
}) => {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex flex-row justify-between">
          <button
            disabled={prevDisabled}
            onClick={handlePrev}
            className={cn({'text-muted-foreground': prevDisabled})}
          >
            prev
          </button>
          <button disabled={nextDisabled} onClick={handleNext}>next</button>
        </div>
      </CardHeader>
      <CardContent className="w-[100%]">
        {
          loading ? (
            <Skeleton className={cn("h-[300px] w-[100%] rounded-xl", {'page-enter': loading, 'page-exit': !loading})} />
          ) : (
            <TransactionsTable
              className={cn({'page-enter': !loading, 'page-exit': loading})}
              data={transactions}
              columns={columns}
              loading={loading}
            />
          )
        }
      </CardContent>
    </Card>
  )
}

export default TestTransactionTable