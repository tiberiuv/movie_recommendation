import mongoose, {Schema} from 'mongoose'

const CastMemberSchema = new Schema ({
    name: {
        type: String,
        unique: true,
        required: [true, 'Name is required!'],
        trim: true,
    },
    photoUrl: {
        type: String,
    },
    roles: {
        type: Array,
        of: String,
    },
    movies: {
        type: Array,
        of: String,
    }
}, {autoIndex: false})



export default mongoose.model('CastMember', CastMemberSchema)