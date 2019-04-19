import {signUp, logIn, health} from './controllers/authController'
import asyncMiddleware from './utils/asyncMiddleware'

const routes = (app) => {
    app.route('/health').get(asyncMiddleware(health))
    app.route('/signup').post(asyncMiddleware(signUp))
    app.route('/login').post(asyncMiddleware(logIn))
}


export default routes