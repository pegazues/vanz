'use client'

import { queryClient } from '@/lib/helper'
import { QueryClientProvider } from '@tanstack/react-query'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
