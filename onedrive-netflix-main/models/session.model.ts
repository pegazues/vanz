import mongoose, { Model, Schema } from 'mongoose'

const SessionSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    ip_address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

let Session = Model<any>
try {
  Session = mongoose.model('Session')
} catch (err) {
  Session = mongoose.model('Session', SessionSchema)
}

export default Session
