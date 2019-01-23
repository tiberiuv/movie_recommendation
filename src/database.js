import mongoose from 'mongoose'
import config from './conf'

mongoose.Promise = Promise

mongoose.connect(config.mongo.uri, { useNewUrlParser: true }).then(
    () => {console.log('connected to db')}
    // err => {console.log('failed to connect')}
)

var db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))
