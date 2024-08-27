'use client'
import React, { useCallback } from 'react'
import {
  usePlaidLink,
  PlaidLinkOnSuccessMetadata,
} from 'react-plaid-link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { exchangeToken } from '@/lib/actions/plaid.actions';

const PlaidLink = ({
  user,
  token,
  variant = 'primary'
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
    console.log('FINAL STEP. [Plaid Link] done processing moving on to dashboard')
    router.push('/dashboard')
  } 
  switch(variant) {
    case 'primary':
      return (
        <Button
          onClick={() => open()}
          disabled={!ready}
          className="text-16 rounded-lg border border-bankGradient bg-bank-gradient font-semibold text-white shadow-form">
            Connect Bank
        </Button>
      )
    case 'ghost':
      return (
        <Button className="flex cursor-pointer items-center justify-center gap-3 rounded-lg px-3 py-7 hover:bg-white lg:justify-start">Connect Bank</Button>
      )
    default:
      return (
        <Button className="flex !justify-start cursor-pointer gap-3 rounded-lg !bg-transparent flex-row">Connect bank</Button>
      )
  }
}

export default PlaidLink