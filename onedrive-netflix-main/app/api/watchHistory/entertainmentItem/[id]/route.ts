import { getOneDriveItem, getTMDBItem } from '@/lib/helper'
import connectDB from '@/lib/mongoose'
import { authOptions } from '@/lib/utils'
import WatchHistory from '@/models/watchHistory.model'
import { handleError } from '@/utils/errorHandler'
import mongoose from 'mongoose'
import { NextApiRequest } from 'next'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.redirect(`${process.env.DEPLOYMENT_URL}/login`)
    }

    const searchParams = request.nextUrl.searchParams
    const pageSize = Math.min(
      parseInt(searchParams.get('pageSize') || '10'),
      10,
    )
    const pageCount = searchParams.get('pageCount') || 1

    const user_email = session.user?.email
    const entertainment_item_id = params.id

    const data = await WatchHistory.find({
      user_email,
      entertainment_item_id: new mongoose.Types.ObjectId(entertainment_item_id),
    })
      .sort({
        updatedAt: -1,
      })
      .skip((+pageCount - 1) * pageSize)
      .limit(pageSize)
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
        tmdb: tmdbResponse[idx],
      }
    })

    return NextResponse.json({
      status: 'success',
      message: 'You have successfully fetched the watch history',
      data: finalData,
    })
  } catch (error) {
    return handleError(error)
  }
}
