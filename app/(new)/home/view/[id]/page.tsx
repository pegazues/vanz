import ViewPage from './details'
import { getServerSession } from 'next-auth'
import {
  ExtraDetailedMovie,
  TMDB_IMAGE_DOMAIN,
  TMDB_POSTER_DOMAIN,
  authOptions,
  doJSON,
  getItemDetailsWithId,
  getUserDetails,
} from '@/lib/utils'
import { redirect } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Cast } from '@/mycomponents/types/cast'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { toast } from 'sonner'
import { Clock2, LucideWatch, Star, Stars, Timer, Watch } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Image } from '@/mycomponents/types/image'
import { Video } from '@/mycomponents/types/video'
import { Review } from '@/mycomponents/types/review'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import CastCarousel from '@/mycomponents/carousels/CastCarousel'

export default async function ItemViewPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login')
  }

  const user = await getUserDetails(
    session.user.email as string,
    session.user.name as string,
  )

  if (user?.role === 'user' && user?.status !== 'accepted') {
    redirect('/home')
  }

  const item = await getItemDetailsWithId(id, user?.language || 'en')

  if (item === null) {
    return <div>Item not found!!!</div>
  }

  const title = item.type === 'movie' ? item.tmdb.title : item.tmdb.name
  const overview = item.tmdb.overview
  const runtime =
    item.type === 'movie'
      ? item.tmdb.runtime
      : item.tmdb.last_episode_to_air.runtime || null

  const release_date =
    item.type === 'movie' ? item.tmdb.release_date : item.tmdb.first_air_date

  return (
    <>
      <div
        className="w-full flex justify-center items-center"
        style={{ height: 'calc( 100vh - 80px )' }}
      >
        <img
          className="w-full absolute top-0 left-0 h-screen object-cover brightness-[60%] select-none -z-10"
          src={
            item.tmdb.backdrop_path
              ? TMDB_IMAGE_DOMAIN + item.tmdb.backdrop_path
              : '/placeholder-big.jpg'
          }
          alt={item.database.title}
        />
        <div className="absolute w-[90%] lg:w-[60%] mx-auto text-left">
          <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold">
            {title}
          </h1>
          <p className="text-white text-lg mt-5 line-clamp-3">{overview}</p>
        </div>
      </div>
      <div className="max-w-[80%] mx-auto mt-8 text-white">
        <h1 className="text-2xl font-bold mb-4">Browse the file below</h1>
        <ViewPage id={id} />
      </div>
      <div className="max-w-[80%] mx-auto mt-8 text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-x-0.5">
          {/* Cast */}
          <div className="col-span-4">
            <CastCarousel cast={item.cast} />
          </div>
          {/* Rating */}
          <div className="col-span-1">
            <RatingCard rating={item.tmdb.vote_average} />
          </div>
          {/* Genres */}
          <div className="col-span-2">
            <GenreCard genres={item.tmdb.genres} />
          </div>
          {/* Runtime in hours card */}
          <div className="col-span-1">
            <RuntimeCard runtime={runtime} type={item.type} />
          </div>
          {/* Release Date Card */}
          <div className="col-span-1">
            <ReleaseDateCard release_date={release_date} />
          </div>
          {/* Images Carousel */}
          <div className="col-span-4">
            <ImagesCarousel images={item.images} />
          </div>
          {/* Trailer Carousel */}
          <div className="col-span-4">
            <TrailerCarousel videos={item.videos} />
          </div>
          {/* Reviews with authors name, avatar image and created date and content as a carousel */}
          <div className="col-span-4">
            <ReviewCarousel reviews={item.review} />
          </div>
        </div>
      </div>
    </>
  )
}

function ReleaseDateCard({ release_date }: { release_date: string }) {
  return (
    <Card className="bg-black text-white border-none group hover:bg-zinc-900">
      <CardHeader>
        <CardTitle className="group-hover:underline">Release Date</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-4xl font-bold">
          {new Date(release_date).toLocaleDateString()}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <Card className="bg-black text-white border-none">
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-white">
            No reviews available
          </CardDescription>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="bg-black text-white border-none">
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <Carousel>
        <CarouselContent>
          {reviews.map((review) => (
            <CarouselItem
              key={review.id}
              className="md:basis-1/2 lg:basis-1/3 group hover:bg-zinc-900 rounded-lg"
            >
              <Card className="bg-black group-hover:bg-zinc-900 border-none p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      review.author_details.avatar_path
                        ? TMDB_IMAGE_DOMAIN + review.author_details.avatar_path
                        : `https://api.dicebear.com/7.x/lorelei/svg?seed=${review.author}&r=50&b=50`
                    }
                    alt={review.author}
                    className="w-24 h-24 rounded-full object-cover bg-white"
                  />
                  <div>
                    <CardDescription className="text-white">
                      {review.author}
                    </CardDescription>
                    <CardDescription className="text-xs text-gray-400">
                      {/* Nicely formatted date and time */}
                      {new Date(review.created_at).toLocaleString()}
                    </CardDescription>
                    <div className="flex items-center text-center gap-[2px]">
                      <span className="text-white text-sm">
                        {review.author_details.rating}
                      </span>
                      {/* 3 stars if rating if >7, 2 if between 4 and 6 and 1 for <4 */}
                      <div className="flex">
                        {review.author_details.rating > 7 ? (
                          <>
                            <Star fill="yellow" strokeWidth={0} size={12} />
                            <Star fill="yellow" strokeWidth={0} size={12} />
                            <Star fill="yellow" strokeWidth={0} size={12} />
                          </>
                        ) : review.author_details.rating > 4 ? (
                          <>
                            <Star fill="yellow" strokeWidth={0} size={12} />
                            <Star fill="yellow" strokeWidth={0} size={12} />
                          </>
                        ) : (
                          <Star fill="yellow" strokeWidth={0} size={12} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-4">
                  {/* Only show some part */}
                  {review.content.slice(0, 200)}...
                </CardDescription>
                {/* View more */}
                <CardFooter className="flex justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <span className="text-white cursor-pointer">
                        View more
                      </span>
                    </DialogTrigger>
                    <DialogContent>
                      {/* Author details same as above */}
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            review.author_details.avatar_path
                              ? TMDB_IMAGE_DOMAIN +
                                review.author_details.avatar_path
                              : `https://api.dicebear.com/7.x/lorelei/svg?seed=${review.author}&r=50&b=50`
                          }
                          alt={review.author}
                          className="w-24 h-24 rounded-full object-cover bg-white"
                        />
                        <div>
                          <CardDescription className="text-white text-lg font-semibold">
                            {review.author}
                          </CardDescription>
                          <CardDescription className="text-md text-gray-400">
                            {new Date(review.created_at).toLocaleString()}
                          </CardDescription>
                          <div className="flex items-center text-center gap-[2px]">
                            <span className="text-white text-md">
                              {review.author_details.rating}
                            </span>
                            <Star fill="yellow" strokeWidth={0} size={12} />
                          </div>
                        </div>
                      </div>
                      <ScrollArea className="text-white max-h-[400px] border-none text-md rounded-md border p-4">
                        {review.content}
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
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

function RuntimeCard({
  runtime,
  type,
}: {
  runtime: number | null
  type: string
}) {
  if (!runtime) {
    return (
      <Card className="bg-black text-white border-none">
        <CardHeader>
          <CardTitle className="flex gap-2">Runtime</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>No runtime available</CardDescription>
        </CardContent>
      </Card>
    )
  }

  const hours = Math.floor(runtime / 60)
  const minutes = runtime % 60
  return (
    <Card className="bg-black text-white border-none group hover:bg-zinc-900">
      <CardHeader>
        <CardTitle className="group-hover:underline flex gap-2">
          <Clock2 color="orange" />
          Runtime {type === 'tv' ? '(per episode)' : ''}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-4xl font-bold">
          {hours > 0 ? `${hours} h` : ''} {minutes}m
        </CardDescription>
      </CardContent>
    </Card>
  )
}

function TrailerCarousel({ videos }: { videos: Video[] }) {
  if (videos.length === 0)
    return (
      <Card className="bg-black text-white border-none">
        <CardHeader>
          <CardTitle>Trailers</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-white">
            No trailers available
          </CardDescription>
        </CardContent>
      </Card>
    )

  return (
    <Card className="bg-black text-white border-none">
      <CardHeader>
        <CardTitle>Trailers</CardTitle>
      </CardHeader>
      <Carousel>
        <CarouselContent>
          {videos
            .map((video) => (
              <CarouselItem key={video.key} className="sm:basis-1/2">
                <iframe
                  src={`https://www.youtube.com/embed/${video.key}`}
                  title={video.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                  style={{
                    aspectRatio: '16/9',
                    width: '100%',
                  }}
                ></iframe>
              </CarouselItem>
            ))
            .reverse()}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Card>
  )
}

function ImagesCarousel({ images }: { images: Image[] }) {
  if (images.length === 0)
    return (
      <Card className="bg-black text-white border-none">
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-white">
            No images available
          </CardDescription>
        </CardContent>
      </Card>
    )

  return (
    <Card className="bg-black text-white border-none rounded-xl">
      <CardHeader>
        <CardTitle>Images</CardTitle>
      </CardHeader>
      <Carousel className="rounded-lg">
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.file_path}>
              <img
                src={TMDB_IMAGE_DOMAIN + image.file_path}
                alt={image.file_path}
                className="w-full h-full object-cover rounded-lg"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </Card>
  )
}

function GenreCard({ genres }: { genres: { id: number; name: string }[] }) {
  if (genres.length === 0) {
    return (
      <Card className="bg-black text-white border-none">
        <CardHeader>
          <CardTitle>Genres</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>No genres available</CardDescription>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="bg-black text-white border-none group hover:bg-zinc-900">
      <CardHeader>
        <CardTitle className="group-hover:underline">Genres</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        {genres.map((genre) => (
          <Badge key={genre.id} variant={'default'} className="text-white">
            {genre.name}
          </Badge>
        ))}
      </CardContent>
    </Card>
  )
}

function RatingCard({ rating }: { rating: number | null }) {
  if (!rating) {
    return (
      <Card className="bg-black text-white border-none">
        <CardHeader>
          <CardTitle className="flex gap-1">Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>No rating available</CardDescription>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="group bg-black text-white border-none hover:bg-zinc-900">
      <CardHeader>
        <CardTitle className="flex gap-1 group-hover:underline">
          <Star fill="yellow" strokeWidth={0} />
          Rating
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          <span className="text-4xl font-bold">{rating.toFixed(1)}</span>
          <span className="text-lg">/10</span>
        </CardDescription>
      </CardContent>
    </Card>
  )
}
