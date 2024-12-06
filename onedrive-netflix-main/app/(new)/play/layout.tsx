'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react'
import { SessionProvider } from 'next-auth/react'
import { redirect, usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useSearchParams()
  const entertainmentItemId = params?.get('entertainmentItemId')
  const onedriveItemId = params?.get('onedriveItemId')

  const [history, setHistory] = useState<any>(undefined)

  useEffect(() => {
    const fetchHistory = async () => {
      const response = await fetch(
        `/api/watchHistory/entertainmentItem/${entertainmentItemId}`,
      )
      const data = await response.json()
      setHistory(data.data)
    }

    if (!history) {
      fetchHistory()
    }
  }, [])

  return (
    <SidebarProvider>
      <SessionProvider>
        <div>
          <Sidebar variant="floating" className="bg-transparent">
            <SidebarHeader />
            <SidebarContent>
              <SidebarHeader className="flex justify-center w-full">
                <p className={cn('text-white text-lg')}>Watch History</p>
              </SidebarHeader>
              <div className="text-sm text-white">
                {!history && (
                  <div className="flex justify-center items-center">
                    <Loader className="animate-spin" />
                  </div>
                )}
                {history && history.length === 0 && (
                  <div className="flex justify-center items-center">
                    <p>No watch history available</p>
                  </div>
                )}
                {history &&
                  history.map((item: any, idx: number) => {
                    return (
                      <Link
                        key={idx}
                        href={`/play?onedriveItemId=${item.onedrive_item_id}&driveId=${item.drive_id}&accountId=${item.account_id._id}&folderId=${item.folder_id}&entertainmentItemId=${entertainmentItemId}&tmdbId={item.tmdb_id}`}
                        target="_black"
                      >
                        <div
                          className={cn(
                            'cursor-pointer hover:bg-gray-700 hover:underline p-2 flex flex-col gap-2 m-2 rounded-lg',
                            item.onedrive_item_id === onedriveItemId &&
                              'bg-gray-700',
                          )}
                          key={idx}
                        >
                          <p className="text-sm">{item.graph.name}</p>
                          <span className="font-semibold">
                            Last Watched: {moment(item.updatedAt).fromNow()}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
              </div>
            </SidebarContent>
          </Sidebar>
        </div>
        {children}
      </SessionProvider>
    </SidebarProvider>
  )
}
