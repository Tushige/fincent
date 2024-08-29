import { AppHeader } from '@/components/app-ui/index';
import {BalanceSummaryBox} from '@/components/BalanceSummaryBox'
import RecentTransactions from '@/components/RecentTransactions';
import { getSignedInUser } from '@/lib/actions/auth.actions';
import { getAccounts, getTransactionsByBankId } from '@/lib/actions/plaid/plaid.actions';

const Page = async () => {
  const banksData = [
    {name: 'chase', label: 'Chase', balance: 1000.19, fill: 'var(--color-chase)'},
    {name: 'america', label: 'Bank of America', balance: 999.23, fill: 'var(--color-america)'},
    {name: 'pnc', label: 'PNC', balance: 999.23, fill: 'var(--color-pnc)'}
  ]
  const userDoc = await getSignedInUser();
  // TODO - figure out a way to remove this call because getTransactions returns accounts data anyways. So this is redundant.
  const accounts = await getAccounts(userDoc.$id)
  const transactions = await getTransactionsByBankId({bankId: accounts[0].bankId})
  return (
    <section className="container flex flex-col">
      <AppHeader title="Welcome" subText="Access manage your account and transactions efficiently." />
      <BalanceSummaryBox banks={banksData}/>
      <RecentTransactions accounts={transactions.accounts} transactions={transactions.transactions} />
    </section>
  )
}

export default Page;