import connectDB from '@/lib/mongoose'
import { getGenreTV } from '@/lib/utils'
import EntertainmentItem from '@/models/entertainmentItem.model'
import { handleError } from '@/utils/errorHandler'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    await connectDB()
    const url = new URL(request.url)
    const genre = url.searchParams.get('genre') || 'Action'
    const limit = Number(url.searchParams.get('limit')) || 20
    const language = url.searchParams.get('language') || 'en'

    const data = await getGenreTV(genre, language, limit)

    return NextResponse.json(
      {
        status: 'success',
        data,
        length: data.length,
      },
      { status: 200 },
    )
  } catch (error) {
    return handleError(error)
  }
}
