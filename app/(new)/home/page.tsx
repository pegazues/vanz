import {
  authOptions,
  doJSON,
  getGenreMovies,
  getGenreTV,
  getRandomItem,
  getRecentMovies,
  getUserDetails,
} from '@/lib/utils'
import GenreCarouselWrapper from '@/mycomponents/GenreCarouselWrapper'
import RequestAccessButton from '@/mycomponents/RequestAccessButton'
import Hero from '@/mycomponents/cards/Hero'
import { CircleSlash, Clock } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Homepage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  const user = await getUserDetails(
    session?.user?.email || '',
    session?.user?.name || '',
  )

  const item = await getRandomItem(user?.language || 'en')
  const recentMovies = await getRecentMovies(user?.language || 'en')

  if (user?.role === 'user') {
    if (user.status === 'created') {
      return (
        <div className="w-screen mt-8">
          <h1 className="text-white text-3xl font-bold mt-8 max-w-max mx-auto">
            Welcome to OneDrive Netflix
          </h1>
          <h2 className="text-white text-xl max-w-max mx-auto mt-4">
            You need to request admin for access
          </h2>
          <div className="max-w-max mx-auto mt-2">
            <RequestAccessButton email={user.email} />
          </div>
        </div>
      )
    } else if (user.status === 'pending') {
      return (
        <div className="w-screen mt-8">
          <h1 className="text-white text-3xl font-bold mt-8 max-w-max mx-auto">
            Welcome to OneDrive Netflix
          </h1>
          <div className="max-w-max mx-auto mt-4 flex gap-2 items-center">
            <Clock size={20} color="white" />
            <h2 className="text-white text-xl">Your request is pending</h2>
          </div>
        </div>
      )
    } else if (user.status === 'rejected') {
      return (
        <div className="w-screen mt-8">
          <h1 className="text-white text-3xl font-bold mt-8 max-w-max mx-auto">
            Welcome to OneDrive Netflix
          </h1>
          <div className="max-w-max mx-auto mt-4 flex gap-2 items-center">
            <CircleSlash size={20} className="text-red-600" />
            <h2 className="text-red-600 text-xl">
              Boss has rejected your request.
            </h2>
          </div>
        </div>
      )
    }
  }

  if (item === null) {
    return (
      <div className="w-screen mt-8">
        <h1 className="text-white text-3xl font-bold mt-8 max-w-max mx-auto">
          Welcome to OneDrive Netflix
        </h1>
        <h2 className="text-white text-xl max-w-max mx-auto mt-4">
          No items found
        </h2>
      </div>
    )
  }

  return (
    <>
      <Hero item={item} />
      <div className="bg-black max-w-7xl mx-auto">
        <GenreCarouselWrapper language={user?.language || 'en'} />
        <div className="h-20"></div>
      </div>
    </>
  )
}
