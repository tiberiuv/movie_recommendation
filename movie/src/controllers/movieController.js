import Movie from '../models/movie'
import retrievePoster from './posterController'
import {sendError, sendSuccess, throwError, throwIf} from '../utils/errorHandling'

export const health = async (req, res) => {
    return sendSuccess(res)('Alive')
}

export const getMovie = async (req, res) => {
    const {id} = req.params
    if(!id) throwError(400, 'Incorrect request','Id is missing')()

    try {
        let movie = await Movie
            .findOne({movieId: id})
            .then(
                throwIf(r => !r, 400, 'Not found', 'MovieId not found'),
                throwError(500, 'Mongodb error')
            )
        if(!movie.posterUrl) {
            const updatedMovie = await savePoster(movie)
                .then(
                    throwIf(r => !r, 404, 'Mongodb error', 'Did not update with poster'),
                )
            return sendSuccess(res)(updatedMovie)
        } 
        return sendSuccess(res)(movie)
    } catch (err) {
        return sendError(res)(err)
    }
}

const savePoster = async (movie) => {
    const posterUrl = await retrievePoster(movie.imdbId, 'IMDB')
    movie = Object.assign(movie, {posterUrl: posterUrl})
    const updatedMovie = await movie.save()
    return updatedMovie
}

export const searchMovies = async (req, res) => {
    try {
        const {offset, count} = req.body
        if(offset === undefined || count === undefined) 
            throwError(400,'Bad Request', 'Offset or count missing in query')()

        const movies = await Movie
            .find({})
            .skip(offset)
            .limit(count)
            .then(
                throwIf(r => !r, 400, 'Not found', 'MovieId not found'),
                throwError(500, 'Mongodb error')
            )
        movies.map(movie => !movie.posterUrl && savePoster(movie))
        sendSuccess(res)(movies)
    } catch (err) {
        sendError(res)(err)
    }
}
