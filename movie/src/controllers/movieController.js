import Movie from '../models/movie'
import retrievePoster from './posterController'
import {sendError, sendSuccess, throwError, throwIf} from '../utils/errorHandling'
import axios from 'axios'
import jwt from 'jsonwebtoken'

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

const getRecommendations = async (req) => {
    const currentToken = req.headers['authorization']
    const {id} = jwt.decode(currentToken)
    const uid = Math.ceil(Math.random() * (138493 - 1) + 1)
    const {data} = await axios.get(`http://127.0.0.1:5000/recommend/${uid}`)
    const idToRating = data.reduce((prev, curr) => {
        prev[curr[1]] = curr[0]
        return prev
    }, {})
    const movies = await Movie
        .find({movieId: { $in: data.map(x => x[1])}})
        .then(
            throwIf(r => !r, 400, 'Not found', 'MovieId not found'),
            throwError(500, 'Mongodb error')
        )
    return movies
        .map(m => ({...m._doc , rating: idToRating[m.movieId]}))
        .sort(({rating: a},{rating: b}) => b - a)
}

export const searchMovies = async (req, res) => {
    try {
        const {offset, count, term, recommendations} = req.body
        if(offset === undefined || count === undefined) 
            throwError(400,'Bad Request', 'Offset or count missing in query')()
        let movies
        if(recommendations) {
            const predictedMovies = await getRecommendations(req)
            return sendSuccess(res)(predictedMovies) 
            
        } else if(!term) {
            movies = await Movie
                .find({})
                .skip(offset)
                .limit(count)
                .then(
                    throwIf(r => !r, 400, 'Not found', 'MovieId not found'),
                    throwError(500, 'Mongodb error')
                )
        } else {
            movies = await Movie
                .find({$text: { $search: term }})
                .skip(offset)
                .limit(count)
                .then(
                    throwIf(r => !r, 400, 'Not found', 'MovieId not found'),
                    throwError(500, 'Mongodb error')
                )
        }
        movies.map(movie => !movie.posterUrl && savePoster(movie))
        sendSuccess(res)(movies)
    } catch (err) {
        sendError(res)(err)
    }
}
