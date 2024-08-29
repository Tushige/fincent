'use client'
import {useMemo} from 'react'
import {Button} from '@/components/ui/button'
import { Label, Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {formatUSD} from '@/lib/utils'

interface Bank {
  name: string,
  balance: number,
  fill: string
}
interface BalanceSummaryProps {
  banks: Bank[]
}

export const BalanceSummaryBox = ({banks=[], ...props}: BalanceSummaryProps) => {
  const totalBalanceAmount = useMemo(() => banks.reduce((curr, bank) => curr + bank.balance, 0), [])
  
  return (
    <div className="flex flex-column min-h-[200px] min-w-[600px] p-4 gap-4 border-solid border-2 border-indigo-600">
      <div className="basis-3/12">
        <ChartContainer className="min-w-[250px]">
          <PieChart width={150} height={150}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
          <Pie
            data={banks}
            nameKey='name'
            dataKey='balance'
            innerRadius={50}
            outerRadius={70}
          >
          </Pie>
          </PieChart>
        </ChartContainer>
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