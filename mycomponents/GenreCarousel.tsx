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

export default function GenreCarousel({
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
    if (!data) Content = <p>No data</p>
    else
      Content = (
        <Carousel className="max-w-[80%] md:max-w-[90%] lg:max-w-[90%] mx-auto mt-8">
          <CarouselContent>
            {data.map((movie, index) => {
              const title =
                movie.type === 'movie' ? movie.tmdb.title : movie.tmdb.name
              return (
                <CarouselItem
                  key={index}
                  className="basis-1/3 md:basis-1/4 lg:basis-1/5 hover:cursor-pointer"
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <img
                        src={
                          movie.tmdb.poster_path
                            ? TMDB_IMAGE_DOMAIN + movie.tmdb.poster_path
                            : `https://api.dicebear.com/7.x/lorelei/svg?seed=${title}&r=50&b=50`
                        }
                        alt="Movie"
                        width={450}
                        height={600}
                        className="rounded-sm w-full h-full object-cover"
                      />
                    </DialogTrigger>
                    <DialogContent className="min-w-[80vw] min-h-[80vh] flex-col items-end border-none rounded-none">
                      <Image
                        src={
                          movie.tmdb.backdrop_path
                            ? TMDB_IMAGE_DOMAIN + movie.tmdb.backdrop_path
                            : '/placeholder-big.jpg'
                        }
                        className="w-full h-full object-cover absolute -z-10 brightness-[20%] rounded-lg"
                        width={1920}
                        height={1080}
                        alt="movie"
                      />
                      <DialogHeader className="w-full max-h-max">
                        <DialogTitle className="text-white text-2xl py-4">
                          {movie.type === 'movie'
                            ? movie.tmdb.title
                            : movie.tmdb.name}
                        </DialogTitle>
                        <DialogDescription className="text-lg text-zinc-400">
                          {movie.tmdb.overview}
                        </DialogDescription>
                        <DialogFooter className="">
                          <Link href={`/home/view/${movie.database._id}`}>
                            <Button className="text-lg p-6 bg-white text-black hover:bg-gray-200">
                              View
                            </Button>
                          </Link>
                          <DialogClose asChild>
                            <Button
                              type="button"
                              variant="destructive"
                              className="text-lg p-6"
                            >
                              Close
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious variant={'outline'} />
          <CarouselNext />
        </Carousel>
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
