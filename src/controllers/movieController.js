import Movie from '../models/movie'
import {sendError, sendSuccess, throwError, throwIf} from '../utils/errorHandling'

export const health = async (req, res) => {
    return res.status(200).json({
        message: 'Alive!'
    })
}

export const getMovie = async (req, res) => {
    const {id} = req.params
    if(id) throwError(400, 'Incorrect Request','Email or password is missing')()

    try {
        const movie = await Movie
            .findOne({movieId: id})
            .then(
                throwIf(r => !r, 400, 'Not found', 'MovieId not found'),
                throwError(500, 'Mongodb error')
            )
        sendSuccess(res, 'Movie found')({movie})
    } catch (err) {
        sendError(res)(err)
    }
}

export const getMovies = async (req, res) => {
    try {
        const movie = await Movie
            .find({})
            .then(
                throwIf(r => !r, 400, 'Not found', 'MovieId not found'),
                throwError(500, 'Mongodb error')
            )
        sendSuccess(res, 'Movie found')({movie})
    } catch (err) {
        sendError(res)(err)
    }
}