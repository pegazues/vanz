import Admin from '@/models/admin.model'
import User from '@/models/user.model'
import chalk from 'chalk'
import { NextApiRequest } from 'next'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params
  const body = await request.json()

  const admin = await Admin.findByIdAndUpdate(id, body, { new: true })
  const user = await User.findByIdAndUpdate(id, body, { new: true })

  return NextResponse.json({ status: 'success', admin, user })
}
