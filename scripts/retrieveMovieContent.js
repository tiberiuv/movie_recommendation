import mongoose from 'mongoose'
import 'dotenv/config'
import rp from 'request-promise'
import {throwError} from '../utils/errorHandling'
import $ from 'cheerio'

const uri = process.env.MONGO_URI
mongoose.Promise = Promise

mongoose.connect(uri, { useNewUrlParser: true }).then(
    () => {console.log('connected to db'); readFiles()}
    // err => {console.log('failed to connect')}
)

const urls = {
    IMDB: 'https://www.imdb.com'
}

const img_regex = {
    IMDB: 'https:\/\/m\.media-amazon\.com.*.jpg'
}

const options = (url) => ({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36'
    },
    url,
})

const retrieveContentOne = async (id, site) => {
    const fullUrl = urls[site] + '/title/tt' + id

    try{
        const html = await rp(options(fullUrl))
        const posterUrl = $('.poster', html).find('img').attr('src')
        const summary = $('.summary_text', html)
        const actors = 
        // const summary = $('.summary_text')
        // const poster_html = await rp(options(posterUrl))
        // const poster = poster_html.match(img_regex[site])[0]
        if(!posterUrl) throwError(404, 'Poster not found')
        return posterUrl

    } catch (err){
        console.error('Error', err)
    }
}