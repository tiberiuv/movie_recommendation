import {health} from './controllers/elasticSearchApi'
import {Application} from 'express'
import asyncMiddleware from './utils/asyncMiddleware'

const routes = (app: Application) => {
    app.route('/health').get(asyncMiddleware(health))
    // app.route('/search').post(asyncMiddleware())
}

export default routes