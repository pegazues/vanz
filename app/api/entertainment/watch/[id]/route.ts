import connectDB from '@/lib/mongoose'
import ContinueWatching from '@/models/continueWatching.model'
import chalk from 'chalk'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB()
    const { id } = params

    const continueWatchingItem = await ContinueWatching.findById(id).populate({
      path: 'entertainment_item_id',
      select: 'title type',
    })

    return NextResponse.json({
      status: 'success',
      message: 'Continue watching item fetched',
      data: continueWatchingItem,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      status: 'error',
      message: 'Error fetching continue watching items',
      error,
    })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params
    const body = await request.json()

    await connectDB()

    const updated = await ContinueWatching.findByIdAndUpdate(id, body, {
      new: true,
    })

    return NextResponse.json({
      status: 'success',
      message: 'Continue watching item updated',
      data: updated,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      status: 'error',
      message: 'Error fetching continue watching items',
      error,
    })
  }
}
