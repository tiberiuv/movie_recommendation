import {health, getMovie, searchMovies} from './controllers/movieController'
import asyncMiddleware from './utils/asyncMiddleware'

const routes = (app) => {
    app.route('/health').get(asyncMiddleware(health))
    app.route('/movies/:id').get(asyncMiddleware(getMovie))
    app.route('/movies/search').post(asyncMiddleware(searchMovies))
}

export default routes