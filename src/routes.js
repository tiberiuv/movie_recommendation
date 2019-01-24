import {signUp, logIn} from './controllers/authController'
import {checkToken} from './middleware'
import asyncMiddleware from './utils/asyncMiddleware'

const routes = (app) => {
    app.route('/signup').post(asyncMiddleware(signUp))
    app.route('/login').post(asyncMiddleware(logIn))
    app.get('/', checkToken, index)
}

const index = (req, res) => {
    return res.json({
        success: true,
        message: 'Index page'
    })
}

export default routes