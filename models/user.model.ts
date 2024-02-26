import mongoose, { Model } from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'rejected', 'pending', 'created'],
  },
  language: {
    type: String,
    enum: ['en', 'it'],
    default: 'en',
  },
})

let User: Model<any>
try {
  User = mongoose.model('User')
} catch (err) {
  User = mongoose.model('User', UserSchema)
}

export default User
