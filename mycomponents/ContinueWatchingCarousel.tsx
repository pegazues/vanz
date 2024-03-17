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
  getContinueWatching,
  getGenreItemsRQ,
} from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { Loader } from 'lucide-react'

export default function ContinueWatchingCarousel({
  language,
}: {
  language: string
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: [language],
    queryFn: () => getContinueWatching(language),
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
        <Carousel className="max-w-[70%] md:max-w-[85%] lg:max-w-[87%] mx-auto mt-8">
          <CarouselContent>
            {data.map((movie, index) => {
              const title = movie.entertainment_item_id.title
              return (
                <CarouselItem
                  key={index}
                  className="basis-1/2 md:basis-1/3 lg:basis-1/5 hover:cursor-pointer"
                >
                  <Link
                    href={`/play?onedriveItemId=${movie.onedrive_item_id}&driveId=${movie.entertainment_item_id.onedrive_id}&accountId=${movie.entertainment_item_id.account}&folderId=${movie.entertainment_item_id.parent_folder}&entertainmentItemId=${movie.entertainment_item_id._id}&tmdbId=${movie.tmdb_id}`}
                  >
                    <img
                      src={
                        movie.entertainment_item_id.poster_image
                          ? movie.entertainment_item_id.poster_image
                          : `https://api.dicebear.com/7.x/lorelei/svg?seed=${title}&r=50&b=50`
                      }
                      alt="Movie"
                      width={450}
                      height={600}
                      className="rounded-sm w-full h-full object-cover"
                    />
                  </Link>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )
  }

  if (data && data.length === 0) {
    return <></>
  }

  return (
    <div className="w-full">
      <h1 className="text-white text-3xl font-bold mt-8 max-w-max mx-auto">
        Continue Watching
      </h1>
      {Content}
    </div>
  )
}
