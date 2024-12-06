import connectDB from '@/lib/mongoose'
import EntertainmentItem from '@/models/entertainmentItem.model'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    await connectDB()
    await EntertainmentItem.deleteMany()

    return NextResponse.json({
      status: 'success',
      message: 'All items removed!',
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      status: 'error',
      message: 'Some error occured!',
      error,
    })
  }
}
