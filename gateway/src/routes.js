import {signUp, logIn, health, createSession} from './controllers/authController'
import asyncMiddleware from './utils/asyncMiddleware'

const routes = (app) => {
    app.route('/health').get(asyncMiddleware(health))
    app.route('/').get(asyncMiddleware(createSession))
    app.route('/signup').post(asyncMiddleware(signUp))
    app.route('/login').post(asyncMiddleware(logIn))
}


export default routes