'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function SessionExceededPage() {
  const params = useSearchParams()

  console.log('Email' + params?.get('email'))
  const email = params?.get('email')
  const name = params?.get('name')

  return (
    <div className="w-screen h-screen bg-white flex flex-col gap-4 items-baseline justify-center p-8">
      <h2 className="text-5xl font-bold block">Dear {name}</h2>
      <div className="text-lg">
        <p>You already an active session from another IP address.</p>
        <p>
          Please logout from that device and try again, or ask the admin to
          reset your existing session.
        </p>
        <p>
          <Link href={'/login'} className="text-blue-500">
            Go to Login Page
          </Link>
        </p>
      </div>
    </div>
  )
}
