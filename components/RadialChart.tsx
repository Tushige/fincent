"use client"

import { TrendingUp } from "lucide-react"
import { RadialBar, RadialBarChart } from "recharts"

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
const chartConfig = {
  FOOD_AND_DRINK: {
    label: "Food and Drink",
  },
  ENTERTAINMENT: {
    label: "Entertainment",
    color: "hsl(var(--chart-1))",
  },
  PERSONAL_CARE: {
    label: "Personal Care",
    color: "hsl(var(--chart-2))",
  },
  GENERAL_SERVICES: {
    label: "General Services",
    color: "hsl(var(--chart-3))",
  },
  GENERAL_MERCHANDISE: {
    label: "General Merchendise",
    color: "hsl(var(--chart-4))",
  },
  TRANSPORTATION: {
    label: "Transportation",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function RadialChart({data}) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart data={data} innerRadius={30} outerRadius={110}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="category" />}
            />
            <RadialBar dataKey="value" background />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
