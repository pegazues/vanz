import connectDB from '@/lib/mongoose'
import EntertainmentItem from '@/models/entertainmentItem.model'
import { handleError } from '@/utils/errorHandler'
import { NextResponse } from 'next/server'
import chalk from 'chalk'
import { LANGUAGES, TMDB_DOMAIN, TMDB_IMAGE_DOMAIN } from '@/lib/utils'
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

      // Introducing a delay between batches to avoid potential issues
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
    const title: string = item.title.split('(')[0].split('[')[0].trim()
    const yearPattern = /\b(19|20)\d{2}\b/g
    const year = (item.title as string).match(yearPattern)

    // console.log(chalk.blue(`Original Title: ${item.title}`))
    // console.log(chalk.yellow(`Modified title: ${title}`))
    // console.log(chalk.yellow(`Year: ${year ? year[year.length - 1] : 'N/A'}`))

    // first look for movie
    let media_type = 'movie'
    let results = await getMovie(
      title,
      year ? year[year.length - 1] : undefined,
      options,
    )
    if (results.total_results == 0) {
      // if no movie found, look for tv show
      console.log(
        chalk.bgRedBright(
          `No movie found for ${item.title}, looking for TV show...`,
        ),
      )
      results = await getTV(title, year ? year[0] : undefined, options)
      media_type = 'tv'
    }

    if (results.total_results == 0) {
      console.log(
        chalk.redBright(
          `Cannot find: Original Title: ${item.title}, Modified Title: ${title}`,
        ),
      )
    } else {
      const bestResultId = results.results[0].id
      const moreMovieDetailsUrl = `${TMDB_DOMAIN}/${media_type}/${bestResultId}`
      const bestMovieResponse = await fetch(moreMovieDetailsUrl, options)
      const bestMovie = await bestMovieResponse.json()

      // update the entertainment Item with the new information...
      const id = item._id
      const genreAsArray = bestMovie?.genres?.map(
        (genre: { id: string; name: string }) => genre.name,
      )

      // Extract above information in variables in one line
      let {
        id: tmdb_id,
        popularity,
        adult,
        vote_count,
        vote_average,
      } = bestMovie

      const type = media_type
      const release_date =
        media_type === 'tv' ? bestMovie.first_air_date : bestMovie.release_date
      const imdb_id = media_type === 'movie' ? bestMovie.imdb_id : null
      const budget = media_type === 'movie' ? bestMovie.budget : null
      const revenue = media_type === 'movie' ? bestMovie.revenue : null

      const status = media_type === 'movie' ? bestMovie.status : null

      let translations: any = {}

      const languageRequests = LANGUAGES.map((lang) => {
        const url = `${TMDB_DOMAIN}/${type}/${tmdb_id}?language=${lang}`
        return fetch(url, options)
      })

      const languageResponses = await Promise.all(languageRequests)
      const languagesData = await Promise.all(
        languageResponses.map((item) => item.json()),
      )

      languagesData.map((item, idx) => {
        translations[LANGUAGES[idx]] = {
          name: item.title || item.name,
          overview: item.overview,
        }
      })

      const updatedItem = await EntertainmentItem.findByIdAndUpdate(
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
          poster_image: bestMovie.poster_path
            ? `${TMDB_IMAGE_DOMAIN}${bestMovie.poster_path}`
            : null,
          backdrop_image: bestMovie.backdrop_path
            ? `${TMDB_IMAGE_DOMAIN}${bestMovie.backdrop_path}`
            : null,
          translations,
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
  year: string | undefined,
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
  searchMovieUrl.searchParams.set('language', 'en-US')
  searchMovieUrl.searchParams.set('include_adult', 'true')
  if (year) {
    searchMovieUrl.searchParams.set('primary_release_year', year)
  }

  const searchResponse = await fetch(searchMovieUrl, options)
  const data = await searchResponse.json()
  // if (data.total_results > 0) {
  //   console.log(
  //     chalk.bgGreenBright(
  //       `Movie Best Match: ${data.results[0].title}, Year: ${data.results[0].release_date}, Original title: ${data.results[0].original_title}`,
  //     ),
  //   )
  // }
  return data
}

async function getTV(
  query: string,
  year: string | undefined,
  options: {
    method: string
    headers: { Authorization: string; accept: string }
  },
) {
  const searchMovieUrl = new URL('/3/search/tv', 'https://api.themoviedb.org')
  searchMovieUrl.searchParams.set('query', query)
  searchMovieUrl.searchParams.set('language', 'en-US')
  searchMovieUrl.searchParams.set('include_adult', 'true')
  if (year) {
    searchMovieUrl.searchParams.set('first_air_date_year', year)
  }

  const searchResponse = await fetch(searchMovieUrl, options)
  const data = await searchResponse.json()

  // if (data.total_results > 0) {
  //   console.log(
  //     chalk.bgGreenBright(
  //       `TV Best Match: ${data.results[0].name}, Year: ${data.results[0].first_air_date}, Original title: ${data.results[0].original_name}`,
  //     ),
  //   )
  // }

  return data
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
