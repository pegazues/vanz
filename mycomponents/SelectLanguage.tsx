'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function SelectLanguage() {
  const [user, setUser] = useState<any>()
  const { data: session } = useSession()

  useEffect(() => {
    const fetchUser = async () => {
      const email = session?.user?.email || ''
      if (!email) return

      const response = await fetch(`/api/user?email=${email}`)
      const data = await response.json()

      setUser(data.user)
    }
    fetchUser()
  }, [session])

  const changeLanguage = async (value: string) => {
    await fetch(`/api/user/${user?._id}`, {
      method: 'PATCH',
      body: JSON.stringify({ language: value }),
    })
    window.location.reload()
  }

  return (
    <Select onValueChange={changeLanguage}>
      <SelectTrigger className="bg-white outline-none active:outline-none">
        <SelectValue
          placeholder={
            !user
              ? 'Loading...'
              : user?.language === 'en'
              ? 'English'
              : 'Italian'
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="it">Italian</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
