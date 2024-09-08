import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CreditCardIcon
} from '@heroicons/react/24/outline'
export function BankDropDown({
  defaultValue,
  options,
  onChange
}: {
  options: Account[],
}) {
  return (
    <Select onValueChange={onChange} defaultValue={defaultValue}>
      <SelectTrigger className="w-[180px] mt-2">
        <SelectValue placeholder="Select fund source" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Please select where you want to transfer funds from</SelectLabel>
          {
            options.map ((option: Account) => (
              <SelectItem key={option.bankId} value={option.bankId}>{option.officialName}</SelectItem>
            ))
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
