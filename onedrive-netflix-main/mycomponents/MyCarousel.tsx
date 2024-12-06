'use client'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Link from 'next/link'
import {
  DetailedMovie,
  DetailedTV,
  TMDB_IMAGE_DOMAIN,
  getGenreItemsRQ,
} from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import Row from '@/app/(new)/test/_components/Row'

export default function MyCarousel({
  genre,
  type,
  language,
}: {
  genre: string
  type: 'movie' | 'tv'
  language: string
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: [type, genre, language],
    queryFn: () => getGenreItemsRQ(genre, type, language),
  })

  let Content = <></>

  if (isLoading) {
    // Show loader in the center of the screen
    Content = (
      <div className="w-full h-full flex justify-center items-center animate-spin mt-8">
        <Loader size={25} color="white" />
      </div>
    )
  } else if (error) {
    Content = <p className="text-red-600">Error: {error.message}</p>
  } else {
    if (!data || data.length === 0) Content = <p>No data</p>
    else
      Content = (
        <Row
          cardContents={data.map((movie) => {
            return {
              title:
                movie.type === 'movie' ? movie.tmdb.title : movie.tmdb.name,
              rating: Math.round(movie.tmdb.vote_average),
              backImage: movie.tmdb.poster_path
                ? TMDB_IMAGE_DOMAIN + movie.tmdb.poster_path
                : `https://api.dicebear.com/7.x/lorelei/svg?seed=${
                    movie.type === 'movie' ? movie.tmdb.title : movie.tmdb.name
                  }&r=50&b=50`,
              frontImage: movie.tmdb.backdrop_path
                ? TMDB_IMAGE_DOMAIN + movie.tmdb.backdrop_path
                : '/placeholder-big.jpg',
            }
          })}
        />
      )
  }

  return (
    <div className="w-full">
      <h1 className="text-white text-3xl font-bold mt-8 max-w-max mx-auto">
        {genre} {type[0].toUpperCase() + type.slice(1)}
      </h1>
      {Content}
    </div>
  )
}
