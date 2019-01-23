import express from 'express'
import routes from './routes'
import config from './conf'
import middlewareConfig from './middleware'
import db from './database'
const app = express()

middlewareConfig(app)

routes(app)

app.listen(config.PORT, err => {
    if(err) {
        throw err;
    } else {
        console.log(`you are server is running on ${config.PORT}`)
    }
})

