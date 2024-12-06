import { Button } from '@/components/ui/button'
import { authOptions, getUserDetails } from '@/lib/utils'
import { Folder, GlassesIcon, Home, Smile, User, UserPlus } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import AdminNavigation from './_components/AdminNavigation'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/home')
  }

  const user = await getUserDetails(
    session?.user?.email || '',
    session?.user?.name || '',
  )
  if (!user || user.role !== 'admin') {
    redirect('/home')
  }

  return (
    <div className="bg-gray-800 w-full fixed h-screen flex p-10">
      <div className="rounded-2xl bg-white w-full flex px-2 py-20">
        <nav className="h-full w-80">
          <AdminNavigation />
        </nav>
        <div className="h-full flex flex-col justify-center">
          <div className="h-full w-0.5 bg-gray-300 rounded-full">&nbsp;</div>
        </div>
        <div className="flex-1 p-2 md:p-6">{children}</div>
      </div>
    </div>
  )
}
