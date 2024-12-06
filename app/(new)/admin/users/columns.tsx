import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { queryClient } from '@/lib/helper'
import { cn, User } from '@/lib/utils'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const user = row.original
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { toast } = useToast()
      const handleStatusChange = async (status: string) => {
        try {
          const res = await fetch('/api/user/access', {
            method: 'POST',
            body: JSON.stringify({ email: user.email, status }),
          })

          if (!res.ok) {
            throw new Error('Failed to update status')
          }
          
          queryClient.invalidateQueries({
            queryKey: ['users'],
          })

          toast({
            title: 'Status updated successfully',
            description: `Status for ${user.name} updated to ${status}`,
          })
        } catch (error) {
          console.error(error)
          toast({
            title: 'Failed to update status',
            description: 'Please try again after some time!',
            variant: 'destructive',
          })
        }
      }

      const statuses = [
        'requested',
        'accepted',
        'rejected',
        'pending',
        'created',
      ]

      const colorMap: {
        [key: string]: string
      } = {
        accepted: 'bg-green-300',
        rejected: 'bg-red-300',
        pending: 'bg-yellow-300',
        requested: 'bg-blue-300',
        created: 'bg-orange-300',
      }

      const handleChange = async (status: string) => {
        try {
          const res = await fetch('/api/user/access', {
            method: 'POST',
            body: JSON.stringify({ email: user.email, status }),
          })

          if (!res.ok) {
            throw new Error('Failed to update status')
          }

        } catch (error) {
          console.error(error)
        }
      }

      return (
        <div className='text-center'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              className={cn('h-8 w-8 p-0', `${colorMap[user.status]}`)}
            >
              <span className="sr-only">See status</span>
              {user.status.charAt(0).toUpperCase()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex flex-col gap-1">
              {statuses.map((status) => (
                <DropdownMenuItem
                  key={status}
                  className={cn(
                    'text-sm',
                    status == user.status && `${colorMap[status]}`,
                  )}
                  onClick={() => handleStatusChange(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      )
    },
  },
  {
    accessorKey: 'language',
    header: 'Language',
    cell: ({row}) => {
      return <div className='text-center'>{row.original.language.toUpperCase()}</div>
    }
  },
]
