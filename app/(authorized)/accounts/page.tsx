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
    <div className="flex flex-col md:py-8 overflow-y-auto gap-8">
      <AppHeader title="Your Cards" className="mb-8"/>
      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {accounts.map(account => (
          <Card className="p-4">
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
      {/* <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        <Card className="p-4">
          <CreditCard bankName={'Checking'} mask={'0000'} bankLink="test bank" className="aspect-video"/>
        </Card>
        <Card  className="p-4">
          <CreditCard bankName={'Checking'} mask={'0000'} bankLink="test bank" className="aspect-video"/>
        </Card>
        <Card  className="p-4">
          <CreditCard bankName={'Checking'} mask={'0000'} bankLink="test bank" className="aspect-video"/>
        </Card>
        <Card  className="p-4">
          <CreditCard bankName={'Checking'} mask={'0000'} bankLink="test bank" className="aspect-video"/>
        </Card>
        <Card  className="p-4">
          <CreditCard bankName={'Checking'} mask={'0000'} bankLink="test bank" className="aspect-video"/>
        </Card>
      </div> */}
    </div>
  )
}

export default Accounts