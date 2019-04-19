import mongoose from 'mongoose'
import Movie from '../src/models/movie'
import 'dotenv/config'
import fs from 'fs'
import parse from 'csv-parser'

const uri = process.env.MONGO_URI
mongoose.Promise = Promise

mongoose.connect(uri, { useNewUrlParser: true }).then(
    () => {console.log('connected to db'); readFiles()}
    // err => {console.log('failed to connect')}
)

var db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const moviePath =  __dirname + '/../../datasets/ml-20m/movies.csv'
const linksPath = __dirname + '/../../datasets/ml-20m/links.csv'

const readFiles = () => {
    var movies = []
    var links = []

    fs.createReadStream(moviePath)
        .pipe(parse({delimiter: ','}))
        .on('data', function(csvrow) {
            movies.push(csvrow)
        })
        .on('error', err => console.log(err))
        .on('end',function() {
            console.log('Done parsed: ', movies.length)
            fs.createReadStream(linksPath)
                .pipe(parse({delimiter: ','}))
                .on('data', function(csvrow) {
                    links.push(csvrow)
                })
                .on('error', err => console.log(err))
                .on('end',function() {
                    console.log(links[0])
                    movies.forEach((item, i) => {
                        item.movieId === links[i].movieId
                            ? Movie.create(makeMovieRecord(item, links[i]))
                            : console.log(`Id doesn't match ${item, links[i]}`)

                    })
                    console.log('Done parsed: ', links.length)
                })
        })
}

const makeMovieRecord = (movie, link) => ({
    movieId: movie.movieId,
    title: movie.title,
    genres: movie.genres,
    imdbId: link.imdbId,
    tmdbId: link.tmdbId
})