'use client'

import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMovieStats } from '@/lib/utils'

export const description = 'A bar chart with an active bar'

const colors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export default function MovieStats() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['movieStats'],
    queryFn: getMovieStats,
  })

  const chartConfig = useMemo(() => {
    if (!data) return

    const config = data.map((item, index) => ({
      [item.genre]: {
        label: item.genre,
        color: colors[index % colors.length],
      },
    }))
    return config
  }, [data])

  const chartData = useMemo(() => {
    if (!data) return
    return data.map((item, index) => ({
      genre: item.genre,
      count: item.count,
      fill: colors[index % colors.length],
    }))
  }, [data])

  console.log(chartConfig)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Our Collection</CardTitle>
        <CardDescription>Movies + TV Shows</CardDescription>
      </CardHeader>
      <CardContent className='h-[90%] flex justify-center'>
        {isLoading && <p>Loading...</p>}
        {!isLoading && (
          <ChartContainer
            className="h-full"
            config={chartConfig as unknown as ChartConfig}
          >
            <BarChart height={10} accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="genre"
                tickLine={false}
                tickMargin={5}
                fontSize={12}
                axisLine={false}
                tickFormatter={(value) => {
                  return value.length > 5 ? `${value.slice(0, 5)}...` : value
                }}
              />
              <YAxis
                tickLine={false}
                tickMargin={5}
                fontSize={12}
                axisLine={false}
                width={30}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                radius={8}
                activeIndex={2}
                activeBar={({ ...props }) => {
                  return (
                    <Rectangle
                      {...props}
                      fillOpacity={0.8}
                      stroke={props.payload.fill}
                      strokeDasharray={4}
                      strokeDashoffset={4}
                    />
                  )
                }}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
