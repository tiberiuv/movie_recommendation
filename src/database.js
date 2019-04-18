import mongoose from 'mongoose'
import 'dotenv/config'

const uri = process.env.MONGO_URI

mongoose.Promise = Promise

mongoose.connect(uri, { useNewUrlParser: true })
    .then(() => console.log(`Connected!`))
    .catch(err => console.log(`Error ! ${err}`))
