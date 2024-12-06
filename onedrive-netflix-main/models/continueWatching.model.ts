import mongoose, { Model } from 'mongoose'
import User from './user.model'
import Admin from './admin.model'
import EntertainmentItem from './entertainmentItem.model'

const ContinueWatchingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    timestamp: {
      type: Number,
      default: 0,
    },
    tmdb_id: {
      type: String,
      required: true,
    },
    onedrive_item_id: {
      type: String,
      required: true,
    },
    entertainment_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EntertainmentItem',
    },
  },
  {
    timestamps: true,
  },
)

let ContinueWatching: Model<any>
try {
  ContinueWatching = mongoose.model('ContinueWatching')
} catch (err) {
  ContinueWatching = mongoose.model('ContinueWatching', ContinueWatchingSchema)
}

export default ContinueWatching
