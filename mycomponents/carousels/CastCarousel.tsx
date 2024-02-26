'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Cast } from '../types/cast'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { TMDB_POSTER_DOMAIN } from '@/lib/utils'
import { toast } from 'sonner'

export default function CastCarousel({ cast }: { cast: Cast[] }) {
  if (cast.length === 0)
    return (
      <Card className="bg-black text-white border-none">
        <CardHeader>
          <CardTitle>Cast</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-white">
            No cast available
          </CardDescription>
        </CardContent>
      </Card>
    )

  return (
    <Card className="bg-black text-white border-none">
      <CardHeader>
        <CardTitle>Cast</CardTitle>
      </CardHeader>
      <Carousel>
        <CarouselContent className="-ml-4">
          {cast.map((person) => (
            <CarouselItem
              key={person.id}
              className="group basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4 pl-4"
              onClick={() => {
                toast.info(`Cannot see more details of ${person.name}`, {
                  duration: 5000,
                  style: {
                    color: 'black',
                    backgroundColor: '#00cec9',
                    border: 'none',
                    userSelect: 'none',
                  },
                })
              }}
            >
              <Card className="group-hover:bg-zinc-800 group-hover:cursor-pointer bg-zinc-900 border-none flex flex-col justify-center items-center rounded-lg p-4 select-none">
                <img
                  src={
                    person.profile_path
                      ? TMDB_POSTER_DOMAIN + person.profile_path
                      : `https://api.dicebear.com/7.x/lorelei/svg?seed=${person.name}&r=50&b=50`
                  }
                  alt={person.name}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                  width={96}
                  height={96}
                />
                <CardDescription className="text-white text-lg font-semibold group-hover:underline group-hover:opacity-80">
                  {person.name}
                </CardDescription>
                <CardDescription>{person.character}</CardDescription>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Card>
  )
}
