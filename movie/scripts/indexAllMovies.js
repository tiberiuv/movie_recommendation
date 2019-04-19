import mongoose from 'mongoose'
import 'dotenv/config'
import {Client} from 'elasticsearch'

const uri = process.env.MONGO_URI
mongoose.Promise = Promise

mongoose.connect(uri, { useNewUrlParser: true }).then(
    () => {console.log('connected to db'); readFiles()}
    // err => {console.log('failed to connect')}
)

const elasticClient = new Client({
    host: 'localhost:9200',
    log: 'info'
})

const indexName = 'movies'

const indexOne = () => {

}

const indexBatch = (offset, count) => {

}

const indexAll = () => {

}

const index = (movie) => {
    return {
        
    }
}

const initIndex = async () => {
    const exists = await elasticClient.indices.exists({index: indexName})
    if(!exists) return await elasticClient.indices.create({index: indexName})
}