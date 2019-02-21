import {health, getMovie, getMovies} from './controllers/movieController'
import asyncMiddleware from './utils/asyncMiddleware'

const routes = (app) => {
    app.route('/health').get(asyncMiddleware(health))
    app.route('/movies/:id').get(asyncMiddleware(getMovie))
    app.route('/movies').get(asyncMiddleware(getMovies))
}

export default routes