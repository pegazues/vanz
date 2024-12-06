'use client'

import { queryClient } from '@/lib/helper'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
