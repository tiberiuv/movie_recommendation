import mongoose, {Schema} from 'mongoose'

const RatingSchema = new Schema ({
    movieId: String,
    userId: Schema.Types.ObjectId,
    rating: Number,
})

export default mongoose.model('Rating', RatingSchema)