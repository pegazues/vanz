import { Button } from '@/components/ui/button'
import { PlayCircle } from 'lucide-react'
import Link from 'next/link'
import { DetailedMovie, DetailedTV } from '@/lib/utils'

export default function Hero({ item }: { item: DetailedMovie | DetailedTV }) {
  let title, overview, backdrop_path, id, movie, tv
  if (item.type === 'movie') {
    movie = item as DetailedMovie
    title = movie.tmdb.title || movie.tmdb.original_title
    overview = movie.tmdb.overview
    backdrop_path = movie.tmdb.backdrop_path
    id = movie.database._id
  } else {
    tv = item as DetailedTV
    title = tv.tmdb.name || tv.tmdb.original_name
    overview = tv.tmdb.overview
    backdrop_path = tv.tmdb.backdrop_path
    id = tv.database._id
  }

  return (
    <div
      className="w-full flex justify-center items-center"
      style={{ height: 'calc( 100vh - 80px )' }}
    >
      <img
        className="w-full absolute top-0 left-0 h-screen object-cover brightness-[60%] select-none -z-10"
        src={
          backdrop_path
            ? `https://image.tmdb.org/t/p/original${backdrop_path}`
            : '/placeholder-big.jpg'
        }
        alt={title}
      />
      <div className="absolute w-[90%] lg:w-[60%] mx-auto text-left">
        <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold">
          {title}
        </h1>
        <p className="text-white text-lg mt-5 line-clamp-3">{overview}</p>
        <div className="flex gap-x-3 mt-4">
          <Link href={`/home/view/${id}`}>
            <Button className="text-lg font-medium p-6 bg-white text-black hover:bg-slate-300">
              <PlayCircle className="mr-2 h-6 w-6" /> Play
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
