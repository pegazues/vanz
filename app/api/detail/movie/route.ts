import connectDB from '@/lib/mongoose'
import EntertainmentItem from '@/models/entertainmentItem.model'
import { handleError } from '@/utils/errorHandler'
import { NextResponse } from 'next/server'
import chalk from 'chalk'
import { TMDB_DOMAIN, TMDB_IMAGE_DOMAIN } from '@/lib/utils'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const request_access_token = process.env.TMDB_ACCESS_TOKEN_AUTH
  const IMAGE_URL = TMDB_IMAGE_DOMAIN

  try {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${request_access_token}`,
        accept: 'application/json',
      },
    }

    // Get all entertainment Items
    await connectDB()
    const entertainmentItems = await EntertainmentItem.find({})

    await makeBatchRequests(entertainmentItems, 50, options)

    return NextResponse.json(
      {
        message: 'Updated Movies info...',
      },
      { status: 200 },
    )
  } catch (error) {
    return handleError(error)
  }
}

async function makeBatchRequests(
  items: any[],
  batchSize: number,
  options: {
    method: string
    headers: { Authorization: string; accept: string }
  },
) {
  try {
    for (let i = 0; i < items.length; i += batchSize) {
      console.log(
        chalk.green(
          `Processing batch ${i / batchSize + 1} of ${Math.ceil(
            items.length / batchSize,
          )}`,
        ),
      )
      const batchUrls = items.slice(i, i + batchSize)
      const promises = batchUrls.map((item) => updateDetails(item, options))

      await Promise.all(promises)

      // Optional: Introduce a delay between batches to avoid potential issues
      // For example, you can use setTimeout to introduce a delay (e.g., 1000 milliseconds)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  } catch (error) {
    console.error('Error making batch requests:', error)
  }
}

async function updateDetails(
  item: any,
  options: {
    method: string
    headers: { Authorization: string; accept: string }
  },
) {
  try {
    // console.log(chalk.bgCyanBright('Finding : ', item.title))
    const title = item.title.split('(')[0].split('[')[0].trim()

    // const results = await getMovie(title, options)
    const results = await getMulti(title, options)
    if (results.total_results == 0) {
      console.log(chalk.redBright('Cannot find: ', title))
    } else {
      const bestResult = results.results[0]
      const moreMovieDetailsUrl = `${TMDB_DOMAIN}/${bestResult.media_type}/${bestResult.id}`
      const bestMovieResponse = await fetch(moreMovieDetailsUrl, options)
      const bestMovie = await bestMovieResponse.json()

      // update the entertainment Item with the new information...
      const id = item._id
      const genreAsArray = bestMovie?.genres?.map(
        (genre: { id: string; name: string }) => genre.name,
      )
      /*

    console.log(chalk.greenBright(`Imdb ID: ${bestMovie.imdb_id}`))
    console.log(chalk.greenBright(`Genre: ${genreAsArray}`))
    console.log(chalk.greenBright(`Tmdb ID: ${bestMovie.id}`))
    console.log(chalk.greenBright(`Popularity: ${bestMovie.popularity}`))
    console.log(chalk.greenBright(`Adult: ${bestMovie.adult}`))
    console.log(chalk.greenBright(`Budget: ${bestMovie.budget}`))
    console.log(chalk.greenBright(`Revenue: ${bestMovie.revenue}`))
    console.log(chalk.greenBright(`Status: ${bestMovie.status}`))
    console.log(chalk.greenBright(`Vote Count: ${bestMovie.vote_count}`))
    console.log(chalk.greenBright(`Vote Average: ${bestMovie.vote_average}`))
    console.log(chalk.greenBright(`Type: ${bestResult.media_type}`))

    */
      // Extract above information in variables in one line
      let {
        id: tmdb_id,
        popularity,
        adult,
        vote_count,
        vote_average,
      } = bestMovie

      const type = bestResult.media_type
      const release_date =
        bestResult.media_type === 'tv'
          ? bestMovie.first_air_date
          : bestMovie.release_date
      const imdb_id =
        bestResult.media_type === 'movie' ? bestMovie.imdb_id : null
      const budget = bestResult.media_type === 'movie' ? bestMovie.budget : null
      const revenue =
        bestResult.media_type === 'movie' ? bestMovie.revenue : null

      const status = bestResult.media_type === 'movie' ? bestMovie.status : null

      await EntertainmentItem.findByIdAndUpdate(
        id,
        {
          release_date,
          imdb_id,
          tmdb_id,
          popularity,
          adult,
          budget,
          revenue,
          status,
          vote_count,
          vote_average,
          type,
          genre: genreAsArray,
        },
        { new: true },
      )
    }
  } catch (error) {
    console.error(chalk.red(error))
  }
}

async function getMovie(
  query: string,
  options: {
    method: string
    headers: { Authorization: string; accept: string }
  },
) {
  const searchMovieUrl = new URL(
    '/3/search/movie',
    'https://api.themoviedb.org',
  )
  searchMovieUrl.searchParams.set('query', query)
  const searchResponse = await fetch(searchMovieUrl, options)
  return await searchResponse.json()
}

async function getMulti(
  query: string,
  options: {
    method: string
    headers: { Authorization: string; accept: string }
  },
) {
  const searchMovieUrl = new URL(
    '/3/search/multi',
    'https://api.themoviedb.org',
  )
  searchMovieUrl.searchParams.set('query', query)
  searchMovieUrl.searchParams.set('language', 'en-US')
  searchMovieUrl.searchParams.set('include_adult', 'true')

  const searchResponse = await fetch(searchMovieUrl, options)
  return await searchResponse.json()
}
