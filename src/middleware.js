import compression from 'compression'
import helmet from 'helmet'
import morgan from 'morgan'
import 'dotenv/config'
import express from 'express'

export default (app) => {
    if(process.env.NODE_ENV === 'prod') {
        app.use(compression())
        app.use(helmet())
    }
    
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())
    app.use( (req, res, next) => {
        res.header('Access-Control-Allow-Origin', "*")
        res.header('Access-Control-Allow-Headers', "*")
        res.header('Access-Control-Allow-Credentials', "*")
        res.header('Access-Control-Expose-Headers', 'x-access-token')
        next()
    })  
    if(process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'))
    }
}
