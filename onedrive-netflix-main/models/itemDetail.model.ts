import { model, Model, Schema } from 'mongoose'

const ItemDetailSchema = new Schema({
  name: {
    type: String,
  },
  overview: {
    type: String,
  },
})

let ItemDetail = new Model<any>()
try {
  ItemDetail = model('ItemDetail')
} catch (error) {
  ItemDetail = model('ItemDetail', ItemDetailSchema)
}

export default ItemDetail
