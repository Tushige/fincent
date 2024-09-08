import { AppHeader } from '@/components/app-ui/index';
import { BalanceSummaryBox3 } from '@/components/BalanceSummaryBox3';
import { getSignedInUser } from '@/lib/actions/auth.actions';
import { getAccounts, getAllTransactions, getBankIncome, getTransactionsByBank } from '@/lib/actions/plaid/plaid.actions';
import RecentTransactions from '@/components/RecentTransactions';
import { CashFlowChartArea } from '@/components/CashFlowChartArea';
import { TopCategories } from '@/components/TopCategories';
import NoData from '@/components/NoData';
import { redirect } from 'next/navigation';

const Page = async () => {
  const userDoc = await getSignedInUser();
  if (!userDoc) {
    redirect('/')
  }
  const accounts = await getAccounts(userDoc.$id)
  if (!accounts || accounts.length < 1) {
    return <NoData />
  }
  const transactions =  await getTransactionsByBank(accounts[0].bankId, null, 0) || []
  const allTransactions = await getAllTransactions(userDoc.$id)
  const banks = accounts?.map(account => ({
    name: account.name,
    balance: account.currentBalance,
  }))
  const income = await getBankIncome(userDoc)
  const fullName = `${userDoc.firstName} ${userDoc.lastName}`

  return (
    <section className="flex flex-col pb-8 md:py-8 overflow-y-auto gap-8">
      <AppHeader title={`Hello, ${fullName}!`} subText="" className="mb-8"/>
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3 xl:gap-8">
        <div className="grid grid-cols-1 gap-4 xl:col-span-2">
          <div className="flex flex-col gap-8">
            <CashFlowChartArea
              className="min-w-64"
                income={income}
                expense={allTransactions?.categorizedTransactions}
              />
            <RecentTransactions transactions={transactions.transactions} />
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