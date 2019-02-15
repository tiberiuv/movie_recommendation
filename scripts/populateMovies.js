import mongodb from 'mongodb'
import env from 'nodenev/config'

const uri = process.env.MONGO_URI

mongodb.MongoClient.connect(uri, function(err, client) {
    if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err)
    }
    console.log('Connected...')
    const collection = client.db("test").collection("devices")

    client.close()
})