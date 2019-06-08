import mongoose, {Schema} from 'mongoose'

const MovieSchema = new Schema ({
    movieId: {
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
        type: String,
        required: [true, 'Genres is required!'],
        trim: true,
        get: genreToArray,
    },
    imdbId: {
        type: String,
        unique: true,
    },
    tmdbId: {
        type: String,
        unique: true,
    },
    posterUrl: {
        type: String,
        unique: true,
    },
    production: {
        type: Schema.Types.ObjectId,
        ref: 'Production'
    }

}, {autoIndex: false})

function genreToArray(genreString) {
    return genreString.split('|')
}

export default mongoose.model('Movie', MovieSchema)
