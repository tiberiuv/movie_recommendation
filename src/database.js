import mongoose from 'mongoose'
import 'dotenv/config'

const uri = process.env.MONGO_URI

mongoose.Promise = Promise

mongoose.connect(uri, { useNewUrlParser: true })
    .then(() => {console.log('connected to db')})
    .catch(err => {console.log('failed to connect', err)})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
