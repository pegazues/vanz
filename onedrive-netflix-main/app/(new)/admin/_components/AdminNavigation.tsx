'use client'
import { cn } from '@/lib/utils'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

const NAVIGATION_ITEMS = [
  {
    title: 'Dashboard',
    link: '/admin/dashboard',
  },
  {
    title: 'Accounts',
    link: '/admin/accounts',
  },
  {
    title: 'Folders',
    link: '/admin/folders',
  },
  {
    title: 'Users',
    link: '/admin/users',
  },
  {
    title: 'Home',
    link: '/home',
  },
]

export default function AdminNavigation() {
  const pathname = usePathname()

  const isPathActive = (path: string): boolean => {
    return pathname?.includes(path) as boolean
  }

  return (
    <div className="flex flex-col items-center justify-between p-4 h-full">
      <div>
        <Image
          src={'/netflix-full.svg'}
          width={150}
          height={150}
          alt="Netflix-logo"
        />
      </div>
      <div className="flex">
        <ul className="flex flex-col gap-8 text-center">
          {NAVIGATION_ITEMS.map((item) => {
            return (
              <li key={item.title}>
                <NavigationItem
                  link={item.link}
                  title={item.title}
                  isActive={isPathActive(item.title.toLowerCase())}
                />
              </li>
            )
          })}
        </ul>
      </div>
      <div
        className="flex gap-2 items-center cursor-pointer border-2 border-muted hover:border-red-500 py-2 px-4 rounded-full duration-200 ease-in-out hover:bg-red-500 hover:text-white transition-all hover:gap-4"
        onClick={() => {
          signOut()
        }}
      >
        <LogOut size={18} />
        <p className="font-thin">Logout</p>
      </div>
    </div>
  )
}

const NavigationItem = ({
  title,
  link,
  isActive,
}: {
  title: string
  link: string
  isActive: boolean
}) => {
  return (
    <Link href={link}>
      <div className={cn(isActive && 'font-bold')}>{title}</div>
    </Link>
  )
}
