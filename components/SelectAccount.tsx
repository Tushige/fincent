'use client'
import React, { useState } from 'react'
import {useRouter} from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { cn } from '@/lib/utils';

const SelectAccount = ({
  accounts,
  setLoading,
  defaultValue,
  className
}) => {
  const router = useRouter()
  const [value, setValue] = useState(defaultValue || null)
  const onChange = (value) => {
    setLoading(true)
    setValue(value)
    router.push(`transaction-history?id=${value}`)
  }

  return (
  <Select onValueChange={onChange} value={value}>
    <SelectTrigger className={cn("w-[100%]", className)}>
      <SelectValue placeholder="Switch Account" />
    </SelectTrigger>
    <SelectContent>
      {
        accounts.map(account => (
          <SelectItem value={account.bankId}>
            {account.name}
          </SelectItem>
        ))
      }
    </SelectContent>
  </Select>
  )
}

export default SelectAccount