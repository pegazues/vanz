import mongoose from 'mongoose'

const WatchHistorySchema = new mongoose.Schema(
  {
    onedrive_item_id: {
      type: String,
      required: true,
    },
    entertainment_item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EntertainmentItem',
      required: true,
    },
    user_email: {
      type: String,
      required: true,
    },
    drive_id: {
      type: String,
      required: true,
    },
    account_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    folder_id: {
      type: String,
      required: true,
    },
    tmdb_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

let WatchHistory = mongoose.Model<any>

try {
  WatchHistory = mongoose.model('WatchHistory')
} catch (error) {
  WatchHistory = mongoose.model('WatchHistory', WatchHistorySchema)
}

export default WatchHistory
