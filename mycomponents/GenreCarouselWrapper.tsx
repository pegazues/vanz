'use client'
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import GenreCarousel from './GenreCarousel'
import ContinueWatchingCarousel from './ContinueWatchingCarousel'
import { queryClient } from '@/lib/helper'

export default function GenreCarouselWrapper({
  language,
}: {
  language: string
}) {
  const movieGenres = [
    'Action',
    'Romance',
    'Thriller',
    'Comedy',
    'Family',
    'Animation',
    'Drama',
    'Crime',
    'Mystery',
    'Science Fiction',
    'War',
    'Music',
    'Fantasy',
  ]

  const tvGenres = [
    'Action & Adventure',
    'Drama',
    'Comedy',
    'Crime',
    'Mystery',
    'Sci-Fi & Fantasy',
    'Kids',
    'Reality',
    'Documentary',
    'Talk',
  ]

  return (
    <QueryClientProvider client={queryClient}>
      <ContinueWatchingCarousel language={language} />
      {movieGenres.map((genre, index) => (
        <GenreCarousel
          key={'movie' + genre}
          genre={genre}
          type="movie"
          language={language}
        />
      ))}
      {tvGenres.map((genre, index) => (
        <GenreCarousel
          key={'tv' + genre}
          genre={genre}
          type="tv"
          language={language}
        />
      ))}
    </QueryClientProvider>
  )
}
