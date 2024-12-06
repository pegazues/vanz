import { getOneDriveItem, getTMDBItem } from '@/lib/helper'
import connectDB from '@/lib/mongoose'
import { authOptions } from '@/lib/utils'
import WatchHistory from '@/models/watchHistory.model'
import { handleError } from '@/utils/errorHandler'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.redirect(`${process.env.DEPLOYMENT_URL}/login`)
    }

    const searchParams = request.nextUrl.searchParams

    const user_email = session.user?.email

    const data = await WatchHistory.find({
      user_email,
    })
      .populate('account_id entertainment_item_id')

    const items = data.map((item) =>
      getOneDriveItem(
        item.account_id.email,
        item.drive_id,
        item.onedrive_item_id,
      ),
    )

    const tmdbItems = data.map((item) =>
      getTMDBItem(
        item.entertainment_item_id.tmdb_id,
        item.entertainment_item_id.type,
      ),
    )

    const graphResposne = await Promise.all(items)
    const tmdbResponse = await Promise.all(tmdbItems)

    const finalData = data.map((item, idx) => {
      return {
        ...item['_doc'],
        graph: graphResposne[idx],
        tmdb: tmdbResponse[idx]
      }
    })

    return NextResponse.json({
      status: 'success',
      message: 'You have successfully fetched the watch history',
      data: finalData,
    })
  } catch (error) {
    console.error(error)
    return handleError(error)
  }
}

export async function POST(request: Request) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.redirect(`${process.env.DEPLOYMENT_URL}/login`)
    }

    const user_email = session.user?.email

    const {
      onedrive_item_id,
      entertainment_item_id,
      drive_id,
      account_id,
      folder_id,
      tmdb_id,
    } = await request.json()

    if (
      !onedrive_item_id ||
      !entertainment_item_id ||
      !drive_id ||
      !account_id ||
      !folder_id ||
      !tmdb_id
    ) {
      throw Error('Please provide all the required fields')
    }

    const exisitingWatchHistory = await WatchHistory.findOne({
      user_email,
      onedrive_item_id,
      entertainment_item_id,
    })

    if (exisitingWatchHistory) {
      const updatedHistory = await WatchHistory.findOneAndUpdate(
        {
          user_email,
          onedrive_item_id,
          entertainment_item_id,
        },
        {},
        { new: true },
      )

      return NextResponse.json({
        status: 'success',
        message: 'You have successfully updated the watch history',
        data: updatedHistory,
      })
    }

    const watchHistory = await WatchHistory.create({
      user_email,
      onedrive_item_id,
      entertainment_item_id,
      drive_id,
      account_id,
      folder_id,
      tmdb_id,
    })

    return NextResponse.json({
      status: 'success',
      message: 'You have successfully added a movie to your watch history',
      data: watchHistory,
    })
  } catch (error) {
    console.error(error)
    return handleError(error)
  }
}
