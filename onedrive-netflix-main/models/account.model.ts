import mongoose, { Model } from 'mongoose'
import ParentFolder from './parentFolder.model'
import EntertainmentItem from './entertainmentItem.model'

const AccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v: string) {
        return /\S+@\S+\.\S+/.test(v)
      },
      message: (props: any) => `${props.value} is not a valid email address`,
    }
  }
})

AccountSchema.pre('findOneAndDelete', async function (next) {
  console.log('findOneAndDelete - Deleting Account along with parent folder and entertainment items')
  await ParentFolder.deleteMany({ account: this.getQuery()._id })
  await EntertainmentItem.deleteMany({ account: this.getQuery()._id })
})

let Account: Model<any>
try {
  Account = mongoose.model('Account')
} catch (err) {
  Account = mongoose.model('Account', AccountSchema)
}

export default Account
