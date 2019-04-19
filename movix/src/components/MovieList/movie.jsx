import STYLES from './index.styl'
import React from 'react'
import {Typography, Card, CardMedia, CardContent, CardActionArea} from '@material-ui/core'
// import Rating from 'react-rating'

export const Movie = ({title, posterUrl, genres, onClick}) => {
    return (
        <Card className={STYLES.card} onClick={onClick}>
            <CardActionArea>
                <CardMedia
                    className={STYLES.poster}
                    image={posterUrl}
                    title={title}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {title}
                    </Typography>
                    <Typography component="p">
                        Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                        across all continents except Antarctica
                    </Typography>
                    <Typography component="p">
                        {genres}
                    </Typography>
                    {/* <Rating/> */}
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default Movie