'use client'

import React, { useState } from 'react'
import { AppBarMixedChart } from './AppBarMixedChart'
import { categoryLabels, formatUSD } from '@/lib/utils'

const chartData_example = [
  { category: "Food", value: 10, fill: "hsl(var(--chart-1))" },
  { category: "Fun", value: 80, fill: "hsl(var(--chart-2))" },
  { category: "Services", value: 20, fill: "hsl(var(--chart-3))"},
  { category: "Transportation", value: 15, fill: "hsl(var(--chart-4))" },
  { category: "Travel", value: 22, fill: "hsl(var(--chart-5))" }
]

const MAX_VALUE = 1
const MIN_VALUE = 0

function normalizeValue(val) {
  let _val = Math.abs(val)
  return (_val - MIN_VALUE) / (MAX_VALUE  - MIN_VALUE);
}
const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))"
]
function extractMonths (transactions) {
  return Object.keys(transactions)
}
export const TopCategories = ({
  transactions,
  className
}) => {
  const months = extractMonths(transactions)
  const [month, setMonth] = useState(months[0])
  const costEntries = Object.entries(transactions[month]).filter(([categoryName, amount]) => {
    return categoryName !== 'total'
  }).toSorted((a, b) => b[1] - a[1])
  const monthlyExpense = costEntries.map( ([categoryName, amount], idx) => {
    return {
      category: categoryLabels[categoryName],
      value: normalizeValue(amount),
      valueLabel: formatUSD(Math.abs(amount)),
      fill: colors[idx]
    }
  })

  return (
    <>
      <AppBarMixedChart
        data={monthlyExpense}
        className={className}
        months={months}
        selected={month}
        onSelect={(value) => setMonth(value)}
      />
    </>
  )
}


