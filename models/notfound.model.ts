import mongoose, { Model, Schema } from "mongoose";

const NotFoundSchema = new Schema({
    title: {
        type: String,
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParentFolder'
    }
})

let NotFound = Model<any>

try
{
    NotFound = mongoose.model('NotFound');
}
catch
{
    NotFound = mongoose.model('NotFound', NotFoundSchema)
}

export default NotFound