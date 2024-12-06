'use client'
import { getUsers } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'

export default function UsersPage() {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })

  return (
    <div className="h-full flex flex-col gap-2 w-full justify-center">
      <DataTable title="Users" data={users || []} columns={columns} />
    </div>
  )
}
