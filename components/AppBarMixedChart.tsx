"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { MonthDropDown } from "./monthDropDown"

const chartConfig = {
  value: {
    label: "value",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "white",
  },
} satisfies ChartConfig

/**
 * 
 * data: {category: <>, value: number}
 */
export function AppBarMixedChart({
  data,
  months,
  selected,
  onSelect
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="flex flex-col justify-center">Expenses</CardTitle>
        <MonthDropDown options={months} selected={selected} onSelect={onSelect}/>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              right: 25,
              left: 0
            }}
          >
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
           
            />
            <XAxis dataKey="value" type="number" hide />
            <Bar dataKey="value" layout="vertical" radius={5}>
              <LabelList
                dataKey="valueLabel"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing expenses for {selected}
        </div>
      </CardFooter>
    </Card>
  )
}