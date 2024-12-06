import {
  getGenreMovies,
  getGenreTV,
  removeDuplicateEntertainmentItems,
} from '@/lib/utils'
import EntertainmentItem from '@/models/entertainmentItem.model'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    return NextResponse.json({
      status: 'success',
      real_ip: request.headers.get('x-real-ip'),
      forwarded_ip: request.headers.get('x-forwarded-for'),
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      status: 'error',
      message: 'Some error occured!',
      error,
    })
  }
}
