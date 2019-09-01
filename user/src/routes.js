import {putRating, getRatings} from './controllers/userController'
import AsyncMiddleware from './utils/asyncMiddleware'

const routes = (app) => {
    app.route('/ratings/:id').post(AsyncMiddleware(putRating))
    app.route('/ratings/:id').get(AsyncMiddleware(getRatings))
}

export default routes