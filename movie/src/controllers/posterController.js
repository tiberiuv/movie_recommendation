import rp from 'request-promise'
import {throwError} from '../utils/errorHandling'
import $ from 'cheerio'

const urls = {
    IMDB: 'https://www.imdb.com/title/tt'
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

export const retrievePosterUrl = async (id, site) => {
    const fullUrl = urls[site] + id

    try{
        const html = await rp(options(fullUrl))
        const posterUrl = $('.poster', html).find('img').attr('src')
        // const summary = $('.summary_text')
        // const poster_html = await rp(options(posterUrl))
        // const poster = poster_html.match(img_regex[site])[0]
        if(!posterUrl) throwError(404, 'Poster not found')
        return posterUrl

    } catch (err){
        console.error('Error', err)
    }
}


export default retrievePosterUrl
