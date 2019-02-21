import {health} from './controllers/movieController'
import asyncMiddleware from './utils/asyncMiddleware'

const routes = (app) => {
    app.route('/health').get(asyncMiddleware(health))
}

export default routes