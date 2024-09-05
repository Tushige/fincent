'use client'
import React, { useCallback } from 'react'
import {
  usePlaidLink,
  PlaidLinkOnSuccessMetadata,
} from 'react-plaid-link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { exchangeToken } from '@/lib/actions/plaid/plaid.actions';
import {
  LinkIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils';
const PlaidLink = ({
  user,
  token,
  variant = 'primary',
  className
}: PlaidLinkProps) => {
  const router = useRouter();
  const config = {
    onSuccess: useCallback(onSuccessHandler, [user]),
    token
  }
  const {open, ready} = usePlaidLink(config);

  async function onSuccessHandler(publicToken: string, metadata: PlaidLinkOnSuccessMetadata) {
    await exchangeToken(
      publicToken,
      user
    )
    router.push(`/dashboard`)
  } 
  switch(variant) {
    case 'primary':
      return (
        <Button
          onClick={() => open()}
          disabled={!ready}
          className="text-16 rounded-lg border border-border bg-background font-semibold text-text hover:text-accent shadow-form">
            Connect Bank
        </Button>
      )
    case 'link':
      return (
        <Button
          onClick={() => {
            open()
          }}
          className={cn("flex h-[48px] items-center gap-2 rounded-md bg-background p-3 text-sm font-medium hover:bg-muted md:justify-center lg:justify-start lg:flex-none lg:p-2 lg:px-3", className)}
        >
          <LinkIcon className="w-6 text-text"/>
          <p className="block md:hidden lg:block text-text text-medium sm: text-lg">Connect Bank</p>
        </Button>
      )
  }
}

export default PlaidLink