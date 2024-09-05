import React from 'react'
import { Card } from '@/components/ui/card';
import { getSignedInUser } from '@/lib/actions/auth.actions';
import { getAccounts } from '@/lib/actions/plaid/plaid.actions';
import { CreditCard } from '@/components/CreditCard';
import { AppHeader } from '@/components/app-ui';

const Accounts = async ({}) => {
  const userDoc = await getSignedInUser();
  const accounts = await getAccounts(userDoc.$id)
  return (
    <div className="flex flex-col gap-8 md:py-8 overflow-y-auto">
      <AppHeader title="Your Cards" className="mb-8"/>
      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {accounts.map(account => (
          <Card className="p-4 w-[390px]">
            <CreditCard
              bankName={account.name}
              mask={account.mask}
              className="aspect-video"
              bankLink={account.shareableId}
              addCopyLink
            />
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Accounts