import { AppHeader } from '@/components/app-ui/index';
import { BalanceSummaryBox3 } from '@/components/BalanceSummaryBox3';
import { getSignedInUser } from '@/lib/actions/auth.actions';
import { getAccounts, getAllTransactions, getBankIncome, getTransactionsByBankId } from '@/lib/actions/plaid/plaid.actions';
import { CashFlowChart } from '@/components/CashFlowChart';
import RecentTransactions from '@/components/RecentTransactions';
import { CashFlowChartArea } from '@/components/CashFlowChartArea';
import { TopCategories } from '@/components/TopCategories';
import { AreaChartExample } from '@/components/AreaChartExample';

const Page = async () => {
  const userDoc = await getSignedInUser();
  // TODO - figure out a way to remove this call because getTransactions returns accounts data anyways. So this is redundant.
  const accounts = await getAccounts(userDoc.$id)
  // const transactions = await getTransactionsByBankId({bankId: accounts[0].bankId})
  const allTransactions = await getAllTransactions(userDoc);
  const banks = accounts?.map(account => ({
    name: account.name,
    balance: account.currentBalance,
  }))
  const income = await getBankIncome(userDoc)
  const fullName = `${userDoc.firstName} ${userDoc.lastName}`

  return (
    <section className="flex flex-col md:py-8 overflow-y-auto gap-8">
      <AppHeader title={`Hello, ${fullName}!`} subText="" className="mb-8"/>
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3 xl:gap-8">
        <div className="grid grid-cols-1 gap-4 xl:col-span-2">
          <div className="flex flex-col gap-8">
            <CashFlowChartArea className="min-w-64" income={income} expense={allTransactions?.categorizedTransactions}/>
            <RecentTransactions transactions={allTransactions.transactions} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <BalanceSummaryBox3 banks={banks} className="min-w-36"/>
          <TopCategories transactions={allTransactions?.categorizedTransactions} />
        </div>
      </div>
    </section>
  )
}

export default Page;