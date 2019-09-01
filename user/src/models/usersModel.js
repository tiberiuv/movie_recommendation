import mongoose, {Schema} from 'mongoose'

const UserSchema = new Schema ({
    first_name: {
        type: String,
        trim: 'true',
    },
    last_name: {
        type: String,
        trim: 'true',
    },
    ratings: [{ type : Schema.Types.ObjectId, ref: 'Rating' }],
})

export default mongoose.model('User', UserSchema)
