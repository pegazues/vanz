import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { History } from 'lucide-react'
import { FC, useEffect, useState } from 'react'

interface WatchHistorySidebarProps {}

const WatchHistorySidebar: FC<WatchHistorySidebarProps> = () => {
  const { toggleSidebar, open } = useSidebar()

  return (
    <div onClick={toggleSidebar}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="flex text-white cursor-pointer p-2 max-h-max rounded-lg hover:bg-gray-800">
              <History />
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className={cn('select-none bg-foreground border-none')}
          >
            <p className="text-white border-1 border-white p-2 bg-gray-800 rounded-lg shadow-md bg-accent-foreground">
              Watch History
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default WatchHistorySidebar
