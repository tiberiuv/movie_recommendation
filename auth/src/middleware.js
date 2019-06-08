import compression from 'compression'
import helmet from 'helmet'
import morgan from 'morgan'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const corsOptions = {
    credentials: true,
    origin: 'http://localhost:8080'
}

export default (app) => {
    if(process.env.NODE_ENV === 'prod') {
        app.use(compression())
        app.use(helmet())
    }
    app.use(cors(corsOptions))
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())
    if(process.env.NODE_ENV === 'dev') {
        app.use(morgan('dev'))
    }
}
