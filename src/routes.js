import {signUp, logIn} from './controllers/authController'
import {checkToken} from './middleware'
const routes = (app) => {
    // app.post('/signUp', signUp)
    app.post('/login', logIn)
    app.get('/', checkToken, index)
}

const index = (req, res) => {
    return res.json({
        success: true,
        message: 'Index page'
    })
}

export default routes