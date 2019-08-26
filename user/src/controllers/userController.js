import User from '../models/usersModel'
import Rating from '../models/ratingModel'
import {sendError, sendSuccess, throwError, throwIf} from '../utils/errorHandling'

export const getRatings = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await User
            .findById(userId)
            .then(
                throwIf(r => !r, 404, 'Not found', 'User not found')
            )
        sendSuccess(res)(user.ratings)
    } catch (err) {
        sendError(res)(err)
    }
}

export const putRating = async (req, res) => {
    try {
        const userId = req.params.id
        const {rating, movieId} = req.body

        if(!(rating || movieId)) throwError(400, 'Bad request', 'Missing id')

        let user = await User
            .findById(userId)

        if(!user) {
            user = await User.create({_id: userId})
        }
        const {_id: ratingId} = await Rating.create({movieId, rating, userId})
            .then(
                throwIf(r => !r, 500, 'Mongo error', 'Rating not created'), 
                throwError(500, 'Mongo error')
            )
        user.ratings.push(ratingId)
        user.save()
        
        sendSuccess(res)(user.ratings)
    } catch (err) {
        sendError(res)(err)
    }
}
