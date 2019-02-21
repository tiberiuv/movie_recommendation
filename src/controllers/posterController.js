import rp from 'request-promise'
import {throwError} from '../utils/errorHandling'
import $ from 'cheerio'
import axios from 'axios'
import fs from 'fs'

const urls = {
    IMDB: 'https://www.imdb.com'
}

const img_regex = {
    IMDB: 'https:\/\/m\.media-amazon\.com.*.jpg'
}

const options = (url) => ({
    simple: false,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36'
    },
    url,
})


export const retrievePosterUrl = async (id, site) => {
    const full_url = urls[site] + '/title/tt' + id 

    try{
        const html = await rp(options(full_url))
        const poster_url = (urls[site] + $('.poster', html).find('a').attr('href'))
        const poster_html = await rp(options(poster_url)) 
        const poster_img_url = poster_html.match(img_regex[site])[0]
        const poster = await rp(options(poster_img_url))
        return poster
    } catch (err){
        console.log(err)
        throwError(err, 'Incorrect url')
    }
}

export default retrievePosterUrl

