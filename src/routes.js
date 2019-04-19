import {health, getMovie, searchMovies} from './controllers/movieController'
import asyncMiddleware from './utils/asyncMiddleware'

const routes = (app) => {
    app.route('/health').get(asyncMiddleware(health))
    app.route('/:id').get(asyncMiddleware(getMovie))
    app.route('/search').post(asyncMiddleware(searchMovies))
}

export default routes