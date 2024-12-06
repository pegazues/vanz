import connectDB from '@/lib/mongoose'
import { authOptions } from '@/lib/utils'
import Admin from '@/models/admin.model'
import ContinueWatching from '@/models/continueWatching.model'
import User from '@/models/user.model'
import chalk from 'chalk'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    await connectDB()
    const url = new URL(request.url)

    const session = await getServerSession(authOptions)
    let user_id = null,
      admin_id = null

    if (session && session.user) {
      const user = await User.findOne({ email: session.user.email })
      if (user) {
        user_id = user._id
      }
      const admin = await Admin.findOne({ email: session.user.email })
      if (admin) {
        admin_id = admin._id
      }
    }

    const page = url.searchParams.get('page')
    const limit = url.searchParams.get('limit')

    let continueWatchingItems: any

    if (user_id) {
      continueWatchingItems = await ContinueWatching.find({
        user_id: user_id,
      })
        .populate({
          path: 'entertainment_item_id',
        })
        .sort({ updatedAt: -1 })
        .limit(limit ? parseInt(limit) : 20)
        .skip(page ? (parseInt(page) - 1) * (limit ? parseInt(limit) : 10) : 0)
        .exec()
    } else if (admin_id) {
      continueWatchingItems = await ContinueWatching.find({
        admin_id,
      })
        .populate({
          path: 'entertainment_item_id',
        })
        .sort({ updatedAt: -1 })
        .limit(limit ? parseInt(limit) : 20)
        .skip(page ? (parseInt(page) - 1) * (limit ? parseInt(limit) : 10) : 0)
        .exec()
    } else {
      continueWatchingItems = []
    }

    return NextResponse.json({
      status: 'success',
      message: 'Continue watching items fetched',
      length: continueWatchingItems.length,
      next:
        continueWatchingItems.length > 0
          ? `${url.origin}/api/entertainment/watch?page=${
              parseInt(page || '1') + 1
            }&limit=${parseInt(limit || '10')}&user=${user_id || admin_id}`
          : null,
      data: continueWatchingItems,
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

export async function POST(request: Request) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    const email = session?.user?.email

    let user_id = null
    let admin_id = null

    const { timestamp, tmdb_id, onedrive_item_id, entertainment_item_id } =
      await request.json()

    let existingItem: any

    if (email) {
      const user = await User.findOne({ email })
      if (user) {
        user_id = user._id
        existingItem = await ContinueWatching.findOne({
          user_id,
          entertainment_item_id,
        })
      } else {
        const admin = await Admin.findOne({ email })
        if (admin) {
          admin_id = admin._id
          existingItem = await ContinueWatching.findOne({
            admin_id,
            entertainment_item_id,
          })
        }
      }
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'Error adding continue watching item',
        error: 'No user or admin found',
      })
    }

    // check if entertainment_item_id and user_id exists in continue watching
    // const existingItem = await ContinueWatching.findOne({
    //   user_id,
    //   admin_id,
    //   entertainment_item_id,
    // })

    if (existingItem && timestamp) {
      const updated = await ContinueWatching.findByIdAndUpdate(
        existingItem._id,
        {
          timestamp,
        },
      )

      return NextResponse.json({
        status: 'success',
        message: 'Continue watching item updated',
        data: updated,
      })
    }

    if (existingItem && !timestamp) {
      return NextResponse.json({
        status: 'success',
        message: 'good',
        data: existingItem,
      })
    }

    let newItem: any
    if (user_id) {
      newItem = await ContinueWatching.create({
        user_id,
        timestamp: timestamp || 0,
        tmdb_id,
        onedrive_item_id,
        entertainment_item_id,
      })
    } else if (admin_id) {
      newItem = await ContinueWatching.create({
        admin_id,
        timestamp: timestamp || 0,
        tmdb_id,
        onedrive_item_id,
        entertainment_item_id,
      })
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'Error adding continue watching item',
        error: 'No user or admin found',
      })
    }

    return NextResponse.json({
      status: 'success',
      message: 'Continue watching item added',
      data: newItem,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      status: 'error',
      message: 'Error adding continue watching item',
      error,
    })
  }
}

export async function DELETE() {
  try {
    await connectDB()

    await ContinueWatching.deleteMany()

    return NextResponse.json({
      status: 'success',
      message: 'Continue watching items deleted',
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({
      status: 'error',
      message: 'Error deleting continue watching item',
      error,
    })
  }
}
