import {getUser, logIn} from './controllers/userController'
import {checkToken} from './middleware'
import AsyncMiddleware from './utils/asyncMiddleware'

const routes = (app) => {
    app.post('/user', AsyncMiddleware(getUser))
}

const index = (req, res) => {
    return res.json({
        success: true,
        message: 'Index page'
    })
}

export default routes