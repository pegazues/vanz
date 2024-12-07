import connectDB from '@/lib/mongoose'
import {
  cleanupEntertainmentItems,
  removeDuplicateEntertainmentItems,
} from '@/lib/utils'
import ContinueWatching from '@/models/continueWatching.model'
import EntertainmentItem from '@/models/entertainmentItem.model'
import NotFound from '@/models/notfound.model'
import chalk from 'chalk'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    await connectDB()

    console.log(chalk.blue('Removing everything...'))
    await EntertainmentItem.deleteMany()
    await ContinueWatching.deleteMany()
    await NotFound.deleteMany()

    console.log(chalk.blue('Adding to DB...'))
    const addToDB = await fetch(
      `${process.env.DEPLOYMENT_URL}/api/entertainment`,
      {
        method: 'POST',
      },
    )
    if (!addToDB.ok) {
      throw new Error('Error adding to DB!')
    }

    console.log(chalk.blue('Getting movie details...'))
    const getMovieDetails = await fetch(
      `${process.env.DEPLOYMENT_URL}/api/detail/movie`,
      {
        method: 'POST',
      },
    )
    if (!getMovieDetails.ok) {
      throw new Error('Error getting movie details!')
    }

    console.log(chalk.blue('Cleaning up & Removing duplicates...'))
    await cleanupEntertainmentItems()
    await removeDuplicateEntertainmentItems()

    return NextResponse.json({
      status: 'success',
      message: 'All done!',
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
