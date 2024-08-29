import { AppHeader } from '@/components/app-ui/index';
import {BalanceSummaryBox} from '@/components/BalanceSummaryBox'
import BalanceSummaryBox2 from '@/components/BalanceSummaryBox2';
import RecentTransactions from '@/components/RecentTransactions';
import { AppLineChart } from '@/components/SpendingChart';
import { getSignedInUser } from '@/lib/actions/auth.actions';
import { getAccounts, getTransactionsByBankId } from '@/lib/actions/plaid/plaid.actions';

const Page = async () => {
  const userDoc = await getSignedInUser();
  // TODO - figure out a way to remove this call because getTransactions returns accounts data anyways. So this is redundant.
  const accounts = await getAccounts(userDoc.$id)
  const transactions = await getTransactionsByBankId({bankId: accounts[0].bankId})
  const banks = accounts?.map(account => ({
    name: account.name,
    balance: account.currentBalance,
  }))
  return (
    <section className="container flex flex-col">
      <AppHeader title="Welcome" subText="Access manage your account and transactions efficiently." />
      <BalanceSummaryBox2 banks={banks}/>
      {/* <div className="w-[600px] mb-50px">
        <AppLineChart />
      </div> */}
      {/* <RecentTransactions accounts={transactions.accounts} transactions={transactions.transactions} /> */}
    </section>
  )
}

export default Page;