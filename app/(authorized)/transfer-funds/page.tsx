import { AppHeader } from '@/components/app-ui'
import TransferFundsForm from '@/components/form/TransferFundsForm'
import { getSignedInUser } from '@/lib/actions/auth.actions'
import { getAccounts } from '@/lib/actions/plaid/plaid.actions'
import React from 'react'

const TransferFundsPage = async () => {
  const userDoc = await getSignedInUser();
  const accounts = await getAccounts(userDoc.$id)
  return (
    <div className="flex flex-col w-[350px] sm:w-[500px] p-2 md:py-8 overflow-y-auto gap-8">
      <AppHeader title="Transfer Funds" />
      <TransferFundsForm accounts={accounts}/>
    </div>
  )
}

export default TransferFundsPage