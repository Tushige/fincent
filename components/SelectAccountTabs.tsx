'use client'
import React, { useTransition, useEffect } from 'react'
import { Link } from "react-transition-progress/next";
import {useRouter} from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { cn } from '@/lib/utils';

const SelectAccountTabs = ({
  accounts,
  setLoading,
  className
}) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const onChange = (value) => {
    router.push(`transaction-history?id=${value}`)
  }

  return (
    <div>
      {
        accounts.map(account => (
          <Link href={`transaction-history?id=${account.bankId}`}>
            {account.name}
          </Link>
        ))
      }
    </div>
  )
}

export default SelectAccountTabs