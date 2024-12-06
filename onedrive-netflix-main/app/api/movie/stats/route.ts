import connectDB from '@/lib/mongoose'
import EntertainmentItem from '@/models/entertainmentItem.model'
import { handleError } from '@/utils/errorHandler'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectDB()

    const data = await EntertainmentItem.aggregate([
      {
        $unwind: '$genre',
      },
      {
        $group: {
          _id: '$genre',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          genre: '$_id',
          count: 1,
        },
      },
      {
        $sort: {
          count: 1,
        },
      },
    ])

    return NextResponse.json(
      {
        status: 'success',
        data,
      },
      {
        status: 200,
      },
    )
  } catch (error) {
    return handleError(error)
  }
}
