import connectDB from '@/lib/mongoose'
import EntertainmentItem from '@/models/entertainmentItem.model'
import next from 'next'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const url = new URL(request.url)
    const pageIndex = parseInt(url.searchParams.get('pageIndex') || '0')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10')
    const { letter, type }: { letter: string; type: string } =
      await request.json()

    const filter: {
      title?: { $regex: string; $options: string }
      type: string
    } = {
      type: type,
    }
    if (letter) {
      filter.title = { $regex: `^${letter}`, $options: 'i' }
    }

    const query = await EntertainmentItem.find(filter)
      .skip(pageSize * pageIndex)
      .limit(pageSize)

    return NextResponse.json({
      data: query,
      pageIndex,
      pageSize,
      nextPage: query.length === pageSize ? pageIndex + 1 : null,
    })
  } catch (error) {
    return NextResponse.json({ message: 'error', error }, { status: 500 })
  }
}
