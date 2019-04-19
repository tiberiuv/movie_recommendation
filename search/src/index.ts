import {Application} from 'express'
import express from 'express'
import routes from './routes'
import middlewareConfig from './middleware'
import 'dotenv/config'

const app: Application = express()
const port = process.env.PORT || '8080'
middlewareConfig(app)

routes(app)

app.listen(port, err => {
    if(err) {
        throw err
    } else {
        console.log(`you are server is running on ${port}`)
    }
})