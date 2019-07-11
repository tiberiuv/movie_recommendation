import mongoose from 'mongoose'
import 'dotenv/config'

const uri = process.env.MONGO_URI

mongoose.Promise = Promise

class Database {
    constructor() {}

    async _connect() {
        await mongoose.connect(uri, { useNewUrlParser: true })
            .catch(err => console.log(`Error ! ${err}`))
    }
}

const connect = async () => {
    const db = new Database()
    await db._connect()
    return db
}

export default connect()

