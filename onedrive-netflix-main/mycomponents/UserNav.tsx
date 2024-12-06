'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { signOut, useSession } from 'next-auth/react'

export default function UserNav() {
  const session = useSession()
  const { toast } = useToast()

  const handleSignout = async () => {
    try {
      signOut()
      const email = session.data?.user?.email

      const response = await fetch('/api/session/', {
        method: 'DELETE',
        body: JSON.stringify({
          email,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data)
      }

      toast({
        title: `Signed out successfully`,
      })
    } catch (error: any) {
      console.error(error)
      toast({
        title: 'Error in signing out',
        description: `Some error occurred: ${error.message}`,
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-sm">
          <Avatar className="h-10 w-10 rounded-sm">
            <AvatarImage src="/avatar.png" />
            <AvatarFallback className="rounded-sm">
              {session.data?.user?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.data?.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.data?.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleSignout}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
