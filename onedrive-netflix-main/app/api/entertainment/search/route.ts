import connectDB from '@/lib/mongoose'
import { TMDB_DOMAIN } from '@/lib/utils'
import EntertainmentItem from '@/models/entertainmentItem.model'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const query = url.searchParams.get('query')
  const language = url.searchParams.get('language') || 'en'
  const page = url.searchParams.get('page') || '1'
  const limit = url.searchParams.get('limit') || '10'

  await connectDB()

  const data = await EntertainmentItem.aggregate([
    {
      $search: {
        index: 'default',
        text: {
          query: query,
          path: `translations.${language}.name`,
          fuzzy: {},
        },
      },
    },
    {
      $skip: (parseInt(page) - 1) * parseInt(limit),
    },
    {
      $limit: parseInt(limit),
    },
  ])

  const finalData = []

  // get cover image for each item from tmdb
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    const response = await fetch(
      `${TMDB_DOMAIN}/${item.type}/${item.tmdb_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN_AUTH}`,
          accept: 'application/json',
        },
      },
    )
    const json = await response.json()
    finalData.push({ ...data[i], cover: json.poster_path })
  }

  return NextResponse.json(
    { data: finalData },
    {
      status: 200,
    },
  )
}
