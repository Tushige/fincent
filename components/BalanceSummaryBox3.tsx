'use client'
import React, { useMemo } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { CreditCard } from './CreditCard'
import { cn, formatUSD } from '@/lib/utils';
import { Button } from './ui/button';
import Link from 'next/link';

ChartJS.register(Tooltip, Legend, ArcElement);

interface Bank {
  name: string,
  balance: number,
  fill: string
}
interface BalanceSummaryProps {
  banks: Bank[],
  className?: string
}

export const BalanceSummaryBox3 = ({
  banks=[],
  className,
  ...props
}: BalanceSummaryProps) => {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="inline-block">
          Your Cards
        </CardTitle>
        <Button className="rounded-lg w-fit m-0">
          <Link href="/link-banks">Add Card +</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <BalanceBox banks={banks}/>
          <Carousel className="mt-8">
            <CarouselContent>
              {
                banks.map(bank => (
                  <CarouselItem key={bank.id}>
                    <CreditCard bankName={bank.name} mask={bank.mask}/>
                  </CarouselItem>
                ))
              }
            </CarouselContent>
            <CarouselPrevious className="top-[-25px] left-[0px]" />
            <CarouselNext className="top-[-25px] right-[0px]"/>
          </Carousel>
        </div>
      </CardContent>
    </Card>
  )
}


function BalanceBox({
  banks=[]
}: {
  banks: Bank[]
}) {
  const totalBalanceAmount = useMemo(() => banks.reduce((curr, bank) => curr + bank.balance, 0), [banks])
  const data = {
    labels: banks.map(bank => bank.name),
    datasets: [{
      data: banks.map(bank => bank.balance),
      label: 'Banks',
      backgroundColor: ['#ee3d6f', '#d43562'] 
    }]
  }
  return (
    <Card className="bg-background rounded-2xl">
      <CardHeader className="px-6 pb-2">
        <CardTitle className="text-text text-sm">
          Total Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="font-black text-4xl">
          {formatUSD(totalBalanceAmount)}
        </div>
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-[200px] h-[200px] md:mt-8">
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
        </div>
      </CardContent>
    </Card>
  )
}