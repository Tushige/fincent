'use client'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'
import { useCopyToClipboard } from './hooks/useCopyToClipboard'
import { useToast } from './hooks/use-toast'
import {
  CheckCircleIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline'

declare interface CreditCardProps {
  bankName: string,
  fullName: string,
  mask: string
}

export const CreditCard = ({
  bankName,
  fullName,
  mask,
  bankLink,
  className
}: CreditCardProps) => {
  const [copiedText, copyToClipboard] = useCopyToClipboard()
  const { toast } = useToast()
  const handleClick = () => {
    copyToClipboard(bankLink)
    toast({
      title: `⭐bank link copied`
    })
  }
  return (
    <>
      <div className={cn(className, "relative flex h-[200px] justify-between rounded-[20px] border border-border backdrop-blur-[6px] overflow-hidden")}>
        <Image src='/icons/jgj6.jpg' width={600} height={350} alt="lines" className="absolute top-0 left-0 h-[373px] w-[640px]"/>
        <div className="relative z-10 flex size-full flex-col justify-between rounded-l-[20px] px-5 pb-4 pt-5">
          <div className="text-medium md:text-xl">{bankName}</div>
          <Image src="/icons/chip-card-40.png" width={48} height={48} alt="credit card chip logo" />
          <div className="text-medium md:text-xl">**** **** **** {mask}</div>
          <div className="flex justify-between w-full">
            <div className="text-medium md:text-xl">**/**</div>
            <Image src="icons/mastercard.svg" width={48} height={48} alt="mastercard logo" />
          </div>
        </div>
      </div>
      <p onClick={handleClick} className="flex flex-row justify-between text-text hover:text-foreground cursor-pointer mt-4">
        {bankLink}
        <ClipboardDocumentIcon className="w-6"/>
      </p>
    </>
  )
}
