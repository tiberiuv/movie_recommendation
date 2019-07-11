import Movie from '../models/movie'
import 'dotenv/config'
import fs from 'fs'
import parse from 'csv-parser'
import db from '../database'
import {retrieveMany} from '../scripts/retrieveMovieContent'
import 'source-map-support/register'
import yargs from 'yargs'

const moviePath =  __dirname + '/../../../datasets/ml-20m/movies.csv'
const linksPath = __dirname + '/../../../datasets/ml-20m/links.csv'

const argv = yargs
    .option('offset', {
        alias: 'o',
        description: 'From which offset to start populating',
        type: 'number',
    })
    .option('count', {
        alias: 'c',
        description: 'How many to retrieve at a time',
        type: 'number',
    }).argv

const parseMovies = async () => {
    return new Promise((resolve, reject) => {
        var movies = []
        var links = []
        var moviesToSave = []

        fs.createReadStream(moviePath)
            .pipe(parse({delimiter: ','}))
            .on('data', function(csvrow) {
                movies.push(csvrow)
            })
            .on('error', err => console.log(err) && reject(err))
            .on('end',function() {
                console.log('Done parsed: ', movies.length)
                fs.createReadStream(linksPath)
                    .pipe(parse({delimiter: ','}))
                    .on('data', function(csvrow) {
                        links.push(csvrow)
                    })
                    .on('error', err => console.log(err) && reject(err))
                    .on('end',function() {
                        movies.forEach((item, i) => {
                            if(item.movieId === links[i].movieId) {
                                moviesToSave.push(makeMovieRecord(item, links[i]))
                            } else console.log(`Id doesn't match ${item, links[i]}`)
                            resolve(moviesToSave)
                        })
                        console.log('Done parsed: ', links.length)
                    })
            })
    })
}

const saveBatch = async (count, offset, movies) => {
    try {
        const end = (count + offset > movies.length)
        const ids = movies.slice(offset, count+offset).map(movie => [movie.imdbId, movie.movieId])
        const moviesMetaData = await retrieveMany(ids)
        const moviesToSave = moviesMetaData.map((metaData, idx) => ({...movies[idx+offset], ...metaData}))
        Movie.insertMany(moviesToSave)
            .then(() => console.log(`Saved ${end ? movies.length : count+offset}/${movies.length} docs`))
        return end
    } catch (err) {
        console.log(err)
    }
}

const saveMovies = async (count = 50, offset = 0) => {
    const movies = await parseMovies()
    let isFinished = false
    let _offset = offset

    while(!isFinished) {
        isFinished = await saveBatch(count, _offset, movies).catch(err => console.log(err))
        _offset += count
    }
}

const makeMovieRecord = (movie, link) => ({
    movieId: movie.movieId,
    title: movie.title,
    genres: movie.genres,
    imdbId: link.imdbId,
    tmdbId: link.tmdbId,
})

db.then(() => saveMovies(argv.count, argv.offset))