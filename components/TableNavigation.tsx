'use client'
import React from 'react'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { testCursor } from '@/lib/data'
import { useRouter } from 'next/navigation'

const TableNavigation = ({
  cursor,
  next_cursor,
  has_more
}) => {
  const router = useRouter();
  const prevHandler = async () => {
    const res = await fetch('/api/cursor-api')
    const prev_cursor = res.prev_cursors.pop()
    router.push(`/transaction-history?cursor=${prev_cursor}`)
  }
  const nextHandler = async () => {
    const res = await fetch('/api/cursor-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'cursor': cursor})
    })
    router.push(`/transaction-history?cursor=${next_cursor}`)
  }
  return (
    <div className="flex flex-row justify-between">
    <Button disabled={cursor === null} onClick={prevHandler}>Previous</Button>
    <Button disabled={!has_more} onClick={nextHandler}>Next</Button>
    </div>
  )
}

export default TableNavigation