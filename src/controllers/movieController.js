import Movie from '../models/movie'
import retrievePoster from './posterController'
import {sendError, sendSuccess, throwError, throwIf} from '../utils/errorHandling'

export const health = async (req, res) => {
    return sendSuccess(res, "Alive!")
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
        if(!movie.poster_url) {
            const posterUrl = await retrievePoster(movie.imdbId, 'IMDB')
            movie = Object.assign(movie, {posterUrl: posterUrl})
            movie.save()
        }
        sendSuccess(res, 'Movie found')({movie})
    } catch (err) {
        sendError(res)(err)
    }
}

export const getMovies = async (req, res) => {
    const {query} = req.body 
    if(!query) sendError(res, 400, 'Query not provided')()
    const {offset, count} = query
    if(!offset || !count) sendError(res, 400, 'Malformed query')()
    try {
        const movie = await Movie
            .find({})
            .skip(offset)
            .limit(count)
            .then(
                throwIf(r => !r, 400, 'Not found', 'MovieId not found'),
                throwError(500, 'Mongodb error')
            )
        sendSuccess(res, 'Movie found')({movie})
    } catch (err) {
        sendError(res)(err)
    }
}
