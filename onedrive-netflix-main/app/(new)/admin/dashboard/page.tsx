'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import MovieStats from './_components/MoviesStats'
import { queryClient } from '@/lib/helper'

export default function DashboardPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <MovieStats />
    </QueryClientProvider>
  )
}
