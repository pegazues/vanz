import { type ClassValue, clsx } from 'clsx'
import { NextAuthOptions } from 'next-auth'
import { twMerge } from 'tailwind-merge'
import GoogleProvider from 'next-auth/providers/google'
import connectDB from './mongoose'
import Admin from '@/models/admin.model'
import User from '@/models/user.model'
import { Movie } from '@/mycomponents/types/movie'
import EntertainmentItem from '@/models/entertainmentItem.model'
import { EntertainmentItem as EI } from '@/mycomponents/types/entertainmentitem'
import { TV } from '@/mycomponents/types/tv'
import { Cast } from '@/mycomponents/types/cast'
import { Image } from '@/mycomponents/types/image'
import { Video } from '@/mycomponents/types/video'
import { Review } from '@/mycomponents/types/review'
import { getAccessToken } from './helper'

export const LANGUAGES = ['en', 'it', 'fr']

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const authOptions: NextAuthOptions = {
  secret: process.env.SECRET as string,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
}

export const doJSON = (data: any) => JSON.parse(JSON.stringify(data))

export const getUserDetails = async (
  email: string,
  name: string,
): Promise<{
  name: string
  email: string
  status?: string
  role: string
  language: string
  _id: string
} | null> => {
  try {
    if (!email || !name) return null
    await connectDB()
    const admin = await Admin.findOne({ email })

    if (admin) return doJSON({ ...admin._doc, role: 'admin' })

    // await User.deleteMany()
    let user = await User.findOne({ email })

    return doJSON({ ...user._doc, role: 'user' })
  } catch (error) {
    return null
  }
}

export type DetailedMovie = {
  database: EI
  type: 'movie'
  tmdb: Movie
}

export type DetailedTV = {
  database: EI
  type: 'tv'
  tmdb: TV
}

export const getRandomItem = async (
  language: string,
): Promise<DetailedMovie | DetailedTV> => {
  await connectDB()
  const count = await EntertainmentItem.countDocuments()
  const random = Math.floor(Math.random() * count)

  const randomItemDatabase = await EntertainmentItem.findOne().skip(random)
  if (!randomItemDatabase) throw new Error('No item found in database')
  const { tmdb_id, type } = randomItemDatabase

  const randomItemTMDB = await fetch(
    `${TMDB_DOMAIN}/${type}/${tmdb_id}?language=${language}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN_AUTH}`,
        accept: 'application/json',
      },
    },
  )

  const randomItem = await randomItemTMDB.json()

  return doJSON({ database: randomItemDatabase, tmdb: randomItem, type })
}

export const getRecentMovies = async (
  language: string,
  limit: number = 20,
): Promise<[DetailedMovie]> => {
  await connectDB()
  const recentMovies = await EntertainmentItem.find({
    type: 'movie',
  })
    .sort({
      release_date: -1,
    })
    .limit(limit)

  const tmdbDetails = await Promise.all(
    recentMovies.map((movie) =>
      fetch(
        `${TMDB_DOMAIN}/${movie.type}/${movie.tmdb_id}?language=${language}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN_AUTH}`,
            Accept: 'application/json',
          },
        },
      ).then((data) => data.json()),
    ),
  )

  const finalResult: DetailedMovie[] = []

  for (let i = 0; i < recentMovies.length; ++i) {
    finalResult.push({
      database: recentMovies[i],
      type: recentMovies[i].type,
      tmdb: tmdbDetails[i],
    })
  }

  return doJSON(finalResult)
}

export const getGenreMovies = async (
  genre: string,
  language: string,
  limit: number = 20,
): Promise<[DetailedMovie]> => {
  await connectDB()
  // const genreMovies = await EntertainmentItem.find({
  //   genre: genre,
  //   type: 'movie',
  // })
  //   .sort({
  //     rating: -1,
  //   })
  //   .limit(limit)

  const genreMovies = await EntertainmentItem.aggregate([
    {
      $match: {
        genre: genre,
        type: 'movie',
      },
    },
    {
      $sort: {
        rating: -1,
      },
    },
    {
      $sample: {
        size: limit,
      },
    },
  ])

  const tmdbDetails = await Promise.all(
    genreMovies.map((movie) =>
      fetch(
        `${TMDB_DOMAIN}/${movie.type}/${movie.tmdb_id}?language=${language}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN_AUTH}`,
            Accept: 'application/json',
          },
        },
      ).then((data) => data.json()),
    ),
  )

  const finalResult: DetailedMovie[] = []

  for (let i = 0; i < genreMovies.length; ++i) {
    finalResult.push({
      database: genreMovies[i],
      type: genreMovies[i].type,
      tmdb: tmdbDetails[i],
    })
  }

  return doJSON(finalResult)
}

export const getGenreTV = async (
  genre: string,
  language: string,
  limit: number = 20,
): Promise<[DetailedTV]> => {
  await connectDB()
  const genreMovies = await EntertainmentItem.find({
    genre: genre,
    type: 'tv',
  })
    .sort({
      rating: -1,
    })
    .limit(limit)

  const tmdbDetails = await Promise.all(
    genreMovies.map((movie) =>
      fetch(
        `${TMDB_DOMAIN}/${movie.type}/${movie.tmdb_id}?language=${language}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN_AUTH}`,
            Accept: 'application/json',
          },
        },
      ).then((data) => data.json()),
    ),
  )

  const finalResult: DetailedTV[] = []

  for (let i = 0; i < genreMovies.length; ++i) {
    finalResult.push({
      database: genreMovies[i],
      type: genreMovies[i].type,
      tmdb: tmdbDetails[i],
    })
  }

  return doJSON(finalResult)
}

export type ExtraDetailedMovie = {
  database: EI
  type: 'movie'
  tmdb: Movie
  cast: Cast[]
  images: Image[]
  videos: Video[]
  review: Review[]
}

export type ExtraDetailedTV = {
  database: EI
  type: 'tv'
  tmdb: TV
  cast: Cast[]
  images: Image[]
  videos: Video[]
  review: Review[]
}

export const getItemDetailsWithId = async (
  id: string,
  language: string,
): Promise<ExtraDetailedMovie | ExtraDetailedTV> => {
  await connectDB()
  const movie = await EntertainmentItem.findById(id)
  const { tmdb_id, type } = movie

  const movieDetailsResponse = fetch(
    `${TMDB_DOMAIN}/${type}/${tmdb_id}?language=${language}&append_to_response=credits,images,videos,reviews`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN_AUTH}`,
        Accept: 'application/json',
      },
    },
  )
  // Promise.all all of the above responses with some delays

  const [movieDetails] = await Promise.all([movieDetailsResponse])

  // Promise.all for json data
  const [movieData] = await Promise.all([movieDetails.json()])

  return doJSON({
    database: movie,
    tmdb: movieData,
    type,
    cast: movieData.credits.cast,
    images: movieData.images.backdrops,
    videos: movieData.videos.results,
    review: [...movieData.reviews.results],
  })
}

export const TMDB_DOMAIN = 'https://api.themoviedb.org/3'
export const TMDB_IMAGE_DOMAIN = 'https://image.tmdb.org/t/p/original'
export const TMDB_POSTER_DOMAIN = 'https://image.tmdb.org/t/p/w154'

export async function cleanupEntertainmentItems() {
  await EntertainmentItem.deleteMany({
    tmdb_id: null,
  })
}

export async function removeDuplicateEntertainmentItems() {
  await connectDB()
  const duplicates: any[] = []

  const x = await EntertainmentItem.aggregate(
    [
      {
        $match: {
          name: { $ne: '' }, // discard selection criteria
        },
      },
      {
        $group: {
          _id: { name: '$tmdb_id' }, // can be grouped on multiple properties
          dups: { $addToSet: '$_id' },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 }, // Duplicates considered as count greater than one
        },
      },
    ],
    { allowDiskUse: true }, // For faster processing if set is larger
  ) // You can display result until this and check duplicates

  x.forEach(function (doc) {
    doc.dups.shift() // First element skipped for deleting
    doc.dups.forEach(function (dupId: any) {
      duplicates.push(dupId) // Getting all duplicate ids
    })
  })

  // If you want to Check all "_id" which you are deleting else print statement not needed
  console.log(duplicates)

  // Delete all duplicates
  await EntertainmentItem.deleteMany({ _id: { $in: duplicates } })
}

export const getGenreItemsRQ = async (
  genre: string,
  type: string,
  language: string,
): Promise<(DetailedMovie | DetailedTV)[]> => {
  const response = await fetch(
    `/api/${type}/genre?genre=${encodeURIComponent(
      genre,
    )}&language=${language}`,
  )
  const data = await response.json()

  // await for 5 seconds
  // await new Promise((resolve) => setTimeout(resolve, 50000))

  return data.data
}

export const getContinueWatching = async (
  language: string,
): Promise<
  {
    _id: string
    user_id: string
    admin_id: string
    timestamp: number
    tmdb_id: string
    onedrive_item_id: string
    entertainment_item_id: EI
    createdAt: Date
    updatedAt: Date
  }[]
> => {
  const response = await fetch(`/api/entertainment/watch?language=${language}`)
  const data = await response.json()

  return data.data
}

export type User = {
  name: string
  email: string
  status: string
  language: string
}

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch('/api/user', { method: 'POST' })
  const data = await response.json()
  console.log(data)

  return [
    ...data.data,
    {
      name: 'John Doe',
      email: 'abv',
      status: 'accepted',
      language: 'en',
    },
    {
      name: 'Jane Doe',
      email: 'xyz',
      status: 'rejected',
      language: 'it',
    },
    {
      name: 'John Doe',
      email: 'abv',
      status: 'accepted',
      language: 'en',
    },
  ]
}

export const getMovieStats = async (): Promise<
  {
    genre: string
    count: number
  }[]
> => {
  const response = await fetch('/api/movie/stats')
  const data = await response.json()

  return data.data
}