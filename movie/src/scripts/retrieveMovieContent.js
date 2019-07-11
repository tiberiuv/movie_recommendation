import 'dotenv/config'
import rp from 'request-promise'
import cheerio from 'cheerio'
import CastMember from '../models/castMember'
import '../database'

const options = (url) => ({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36'
    },
    url,
})

const retrieveCast = async (imdbId, movieId, n = 10) => {
    const url = `https://m.imdb.com/title/tt${imdbId}/fullcredits/cast?ref_=m_tt_cl_sc`
    const html = await rp(options(url))
    const $ = cheerio.load(html)
    let cast = []
    let i = 0
    while (i < n) {
        try {
            const name = $(`h4`)
                .slice(i, i + 1)
                .text()
            let image = undefined
            try {
                image = $(".media-object")[i + 1].attribs.src.split("@._")[0] + "@._V1_QL50.jpg"
            } catch (err) {}
            const roles = $(".h4")
                .slice(i + 1, i + 2)
                .text()
                .split("\n")
                .join("")
                .split("/")
            if(name && roles && roles.length)
                cast.push({
                    name, 
                    photoUrl: image,
                    roles,
                    movies: [movieId],
                })
            i++
        } catch (err) {
            console.log(url, err)
            i++
        }
    }
    return cast
}

const retrievePosterAndSummary = async (id) => {
    const url = `https://www.imdb.com/title/tt${id}/`
    const html = await rp(options(url))
    const $ = cheerio.load(html)
    try {
        
        const summary = $(`.summary_text`).text().trim()
        // const directors = cheerio.load(html)('[itemprop=name]')[0]
        //     .text()
        //     .trim()
        //     .split(',')
        // console.log(directors)
        let posterElement = undefined
        try{
            posterElement = cheerio.load(html)(".poster >a:nth-child(1) >img:nth-child(1)")[0].attribs.src.split("@._")[0] + "@._V1_QL50.jpg"
        } catch (err) {}
        let posterUrl = posterElement
            ? posterElement
            : $('.poster').find('img').attr('src')
        return {summary, posterUrl}
    } catch (err) {
        console.log(err)
    }
}

const createCast = async (member) => 
    await CastMember.create(member)


const updateCast = async (memberDoc, member) => {
    // console.log('Current: ',memberDoc.toObject())
    // console.log('New: ', member)
    if(member.roles && member.roles.length > 0) {
        await memberDoc.updateOne(
            {
                $addToSet: {
                    movies: member.movies[0],
                    roles: {$each: [...member.roles]},
                }
            },
        )
        // console.log(result)
    }
    return memberDoc
}


const updateOrCreateCast = async (cast) => {
    try{
        const castMembers = await Promise.all(cast
            .map(cm => CastMember.findOne({name: cm.name})))

        return await Promise.all(
            castMembers.map((member,idx) => 
                !member ? createCast(cast[idx]) : updateCast(member, cast[idx])
            )
        )
        // return await Promise.all(cast
        //     .map(async (cm,idx) => 
        //         await CastMember.findOne({name: cm.name})
        //             .then(member => !member ? createCast(cast[idx]) : updateCast(member, cast[idx]))
        //     ))
    } catch (err) {
        console.log(err)
    }
}

const toMetaData = (promises) => {
    const [posterAndSummary, cast] = promises
    return {
        ...posterAndSummary,
        castMembers: cast ? cast.map(item => item._id) : [],
    }
}  

const retrieveContentOne = async (imdbId, movieId)  => {
    try{
        return await Promise.all([
            retrievePosterAndSummary(imdbId),
            retrieveCast(imdbId, movieId, 10).then(cast => updateOrCreateCast(cast))
        ]
        ).then(toMetaData)
    
    } catch (err) {
        console.log('Error retrieving content', err)
    }

}
export const retrieveMany = async (ids) => {
    try{
        return Promise.all(ids.map(([imdbId, movieId]) => retrieveContentOne(imdbId, movieId)))
    } catch (err) {
        console.log(err)
    }
}