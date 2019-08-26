import {getUser, logIn, putRating, getRatings} from './controllers/userController'
import {checkToken} from './middleware'
import AsyncMiddleware from './utils/asyncMiddleware'

const routes = (app) => {
    // app.route('/user').get(AsyncMiddleware(getUser))
    app.route('/ratings/:id').post(AsyncMiddleware(putRating))
    app.route('/ratings/:id').get(AsyncMiddleware(getRatings))
}

export default routes