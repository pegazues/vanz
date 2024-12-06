import connectDB from '@/lib/mongoose'
import { authOptions } from '@/lib/utils'
import User from '@/models/user.model'
import { handleError } from '@/utils/errorHandler'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)

    const { email, status } = await request.json()

    if (session?.user?.email == email) {
      throw Error('You cannot change your own status!')
    }

    const user = await User.findOneAndUpdate(
      { email },
      {
        status,
      },
      { new: true },
    )

    if (!user) {
      throw Error('User not found!')
    }

    return NextResponse.json({
      status: 'success',
      user,
    })
  } catch (error) {
    return handleError(error)
  }
}
