import mongoose, {Schema} from 'mongoose'
import validator from 'validator'

const MovieSchema = new Schema ({
    id: {
        type: String,
        unique: true,
        required: [true, 'Id is required!'],
        trim: true,
    },
    title: {
        type: String,
        required: [true, 'Title is required!'],
        trim: true,
    },
    genres: {
        type: Array,
        required: [true, 'Genre is required!'],
        trim: true,
    },
    imdbId: {
        type: String,
        unique: true,
    },
    tmbdId: {
        type: String,
        unique: true,
    }
})

export default mongoose.model('Movie', MovieSchema)