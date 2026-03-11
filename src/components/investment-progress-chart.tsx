"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

const chartData = [
  { month: "يناير", amount: 1860 },
  { month: "فبراير", amount: 3050 },
  { month: "مارس", amount: 2370 },
  { month: "أبريل", amount: 7300 },
  { month: "مايو", amount: 5090 },
  { month: "يونيو", amount: 11240 },
]

const chartConfig = {
  amount: {
    label: "المبلغ",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function InvestmentProgressChart() {
  return (
    <Card className="w-full max-w-sm rounded-2xl">
      <CardHeader>
        <CardTitle>تقدم التمويل</CardTitle>
        <CardDescription>
          مخطط يوضح نمو المبلغ المجمع للمشروع خلال الأشهر الماضية.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
             <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `ر.س ${value / 1000}k`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <defs>
                <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                <stop
                    offset="5%"
                    stopColor="var(--color-amount)"
                    stopOpacity={0.8}
                />
                <stop
                    offset="95%"
                    stopColor="var(--color-amount)"
                    stopOpacity={0.1}
                />
                </linearGradient>
            </defs>
            <Area
              dataKey="amount"
              type="natural"
              fill="url(#fillAmount)"
              stroke="var(--color-amount)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              التمويل في تزايد مستمر <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              البيانات تغطي آخر 6 أشهر.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
