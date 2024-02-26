import connectDB from '@/lib/mongoose'
import EntertainmentItem from '@/models/entertainmentItem.model'
import { handleError } from '@/utils/errorHandler'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    await connectDB()
    const url = new URL(request.url)
    const select = url.searchParams.get('select') || ''

    const incompleteItems = await EntertainmentItem.find({
      imdb_id: null,
    }).select(select)

    return NextResponse.json({
      status: 'success',
      entertainmentItems: incompleteItems,
    })
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB()
    const url = new URL(request.url)

    await EntertainmentItem.deleteMany({
      imdb_id: null,
    })

    await EntertainmentItem.find({})

    const data = await EntertainmentItem.aggregate([
      {
        $group: {
          _id: { cover_image: '$cover_image' },
          slugs: { $addToSet: '$_id' },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ])

    data.forEach(async function (doc) {
      doc.slugs.shift()
      await EntertainmentItem.deleteMany({
        _id: { $in: doc.slugs },
      })
    })

    return NextResponse.json({
      status: 'success',
    })
  } catch (error) {
    return handleError(error)
  }
}
