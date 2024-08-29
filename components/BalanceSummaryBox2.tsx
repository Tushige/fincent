'use client'

import React, { useMemo } from 'react'
import {Button} from '@/components/ui/button'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {formatUSD} from '@/lib/utils'

ChartJS.register(Tooltip, Legend, ArcElement);
interface Bank {
  name: string,
  balance: number,
  fill: string
}
interface BalanceSummaryProps {
  banks: Bank[]
}

const BalanceSummaryBox2 = ({banks=[], ...props}: BalanceSummaryProps) => {
  const totalBalanceAmount = useMemo(() => banks.reduce((curr, bank) => curr + bank.balance, 0), [banks])
  const data = {
    labels: banks.map(bank => bank.name),
    datasets: [{
      data: banks.map(bank => bank.balance),
      label: 'Banks',
      backgroundColor: ['#0747b6', '#2265d8'] 
    }]
  }
  return (
    <div className="flex flex-column min-h-[200px] min-w-[600px] p-4 gap-4 border-solid border-2 border-indigo-600">
      <div className="basis-3/12">
        <Doughnut 
          data={data} 
          options={{
            cutout: '60%',
            plugins: {
              legend: {
                display: false
              }
            }
          }}
        />
      </div>
      <div className="flex flex-col gap-8 w-full relative">
        <div className="text-bold">{banks.length} Bank Accounts</div>
        <div className="flex flex-col gap-2">
          <div>
            Total Current Balance
          </div>
          <div className="text-bold text-2xl">
            {formatUSD(totalBalanceAmount)}
          </div>
        </div>
        <div className="position absolute top-0 right-0">
          <Button className="">Add Bank</Button>
        </div>
      </div>
    </div>
  )

}

export default BalanceSummaryBox2