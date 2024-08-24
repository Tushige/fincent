import { AppHeader } from '@/components/app-ui/index';
import {BalanceSummaryBox} from '@/components/BalanceSummaryBox'

const RootPage = () => {
  const banksData = [
    {name: 'chase', label: 'Chase', balance: 1000.19, fill: 'var(--color-chase)'},
    {name: 'america', label: 'Bank of America', balance: 999.23, fill: 'var(--color-america)'},
    {name: 'pnc', label: 'PNC', balance: 999.23, fill: 'var(--color-pnc)'}
  ]
  return (
    <section className="w-full flex ">
      <div className="">
        <AppHeader title="Welcome" subText="Access manage your account and transactions efficiently." />
        <BalanceSummaryBox banks={banksData}/>
      </div>
    </section>
  )
}

export default RootPage;