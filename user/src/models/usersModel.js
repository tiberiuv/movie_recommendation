import mongoose, {Schema} from 'mongoose'

const UserSchema = new Schema ({
    first_name: {
        type: String,
        required: [true, 'First name is required!'],
        trim: 'true',
    },
    last_name: {
        type: String,
        required: [true, 'Last name is required!'],
        trim: 'true',
    },
    ratings: {
        type: Map,
        of: Number,
    }
})

export default mongoose.model('User', UserSchema)
