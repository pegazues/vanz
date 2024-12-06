import connectDB from '@/lib/mongoose'
import Session from '@/models/session.model'
import User from '@/models/user.model'
import { handleError } from '@/utils/errorHandler'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'success',
    },
    {
      status: 201,
    },
  )
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const body = await request.json()

    const { user_id } = body

    if (user_id == null) {
      throw new Error('account_id expected in body')
    }

    const real_ip = request.headers.get('x-real-ip')

    const result = await Session.findOne({ user: user_id })
    if (result) {
      console.log(
        `Found existing session: IP: ${
          result.ip_address
        } && ${request.headers.get('x-real-ip')}`,
      )
      if (result.ip_address === request.headers.get('x-real-ip')) {
        return NextResponse.json({
          message: 'success',
        })
      }
      throw new Error('There is already an active session for this user')
    }

    const newSession = await Session.create({
      user: user_id,
      ip_address: real_ip,
    })

    return NextResponse.json(
      {
        message: 'success',
        session: newSession,
      },
      {
        status: 201,
      },
    )
  } catch (error) {
    return handleError(error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json()

    const user = await User.findOne({ email })

    await Session.findOneAndDelete({
      user: user._id,
    })

    return new Response(null, { status: 204 })
  } catch (error) {
    return handleError(error)
  }
}
