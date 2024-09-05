import React from 'react'
import { AppHeader } from '@/components/app-ui'
import { getSignedInUser } from '@/lib/actions/auth.actions';
import { getAccounts } from '@/lib/actions/plaid/plaid.actions';
import TransactionHistoryClientUI from '@/components/TransactionHistoryClientUI';
import AccountDetails from '@/components/AccountDetails';

const TransactionHistoryPage = async ({searchParams}: {
  searchParams: {
    id?: string
  }
}) => {
  const userDoc = await getSignedInUser();
  const accounts = await getAccounts(userDoc.$id)
  const bankDocId = (searchParams.id as string) || accounts[0]?.bankId
  const account = accounts?.filter(account => account.bankId === bankDocId)[0]
  return (
    <section className="md:py-8">
      <AppHeader title="Transaction History" className="mb-4 lg:mb-8"/>
      <TransactionHistoryClientUI accounts={accounts} bankId={bankDocId} account={account}/>
    </section>
  )
}

export default TransactionHistoryPage