import connectDB from '@/lib/mongoose'
import Admin from '@/models/admin.model'
import Session from '@/models/session.model'
import User from '@/models/user.model'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const authOptions: NextAuthOptions = {
  secret: process.env.SECRET as string || 'thisisalsoaverysecuresecret',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    signIn: async (params) => {
      try {
        console.log(`...nextauth | User has signed in : ${params.user.name}`)
        await connectDB()

        let admin = await Admin.findOne({ email: params.user.email })
        if (admin) return true

        let user = await User.findOne({ email: params.user.email })
        if (!user) {
          user = await User.create({
            name: params.user.name,
            email: params.user.email,
            status: 'created',
          })
        }

        const response = await fetch(
          `${process.env.NEXTAUTH_URL}/api/session`,
          {
            method: 'POST',
            body: JSON.stringify({
              user_id: user._id,
            }),
          },
        )

        if (!response.ok) {
          return `/session-exceeded?email=${params.user.email}&name=${params.user.name}`
        }
      } catch (error) {
        console.error(error)
      }
      return true
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
