import React from 'react'
import { Card } from '@/components/ui/card';
import { getSignedInUser } from '@/lib/actions/auth.actions';
import { getAccounts } from '@/lib/actions/plaid/plaid.actions';
import { CreditCard } from '@/components/CreditCard';
import { AppHeader } from '@/components/app-ui';
import NoData from '@/components/NoData';
import { redirect } from 'next/navigation';

const Accounts = async ({}) => {
  const userDoc = await getSignedInUser();
  if (!userDoc) {
    redirect('/')
  }
  const accounts = await getAccounts(userDoc.$id)
  if (!accounts || accounts.length < 1) {
    return (
      <NoData/>
    )
  }
  return (
    <div className="flex flex-col gap-8 md:py-8 overflow-y-auto">
      <AppHeader title="Your Cards" className="mb-8"/>
      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {
          accounts.map((a: any) => {
            return (
              <Card key={a.id} className="p-4 w-[390px]">
                <CreditCard
                  bankName={a.name}
                  mask={a.mask}
                  className="aspect-video"
                  bankLink={a.shareableId}
                  addCopyLink
                />
              </Card>
            )
          }
        )}
      </div>
    </div>
  )
}

export default Accounts