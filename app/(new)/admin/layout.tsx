import { Button } from '@/components/ui/button'
import { authOptions, getUserDetails } from '@/lib/utils'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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
    <div className="bg-white fixed overflow-scroll w-screen h-screen">
      <nav className="flex max-w-max mx-auto mt-8">
        <ul className="flex gap-4">
          <li>
            <Link href="/admin/accounts">
              <Button variant={'secondary'}>Accounts</Button>
            </Link>
          </li>
          <li>
            <Link href="/admin/folder">
              <Button variant={'secondary'}>Folders</Button>
            </Link>
          </li>
          {/* <li>
            <Link href="/admin/update-entertainment-item">
              <Button variant={'secondary'}>Update Entertainmetn Items</Button>
            </Link>
          </li> */}
        </ul>
      </nav>
      {children}
    </div>
  )
}
