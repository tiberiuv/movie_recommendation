import STYLES from './index.styl'
import React, {useState} from 'react'
import {Typography, Card, CardMedia, CardContent, CardActionArea, Icon} from '@material-ui/core'
import Rating from 'react-rating'
import connect from '../../connectRefetch'

export const Movie = ({title, posterUrl, genres, summary, onClick, handleRatingChange, rating}) => {
    const displayGenres = () => genres.replace('|', ' ')
    return (
        <Card onClick={onClick}>
            <CardMedia className={STYLES.poster} image={posterUrl} title={title} />
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    {title}
                </Typography>
                <Typography component="p">{summary}</Typography>
                <br />
                <Typography component="p"> {displayGenres()} </Typography>
                <Rating
                    onChange={handleRatingChange}
                    initialRating={rating}
                    emptySymbol={
                        <Icon className={STYLES.starIcon} fontSize="large">
                            star_border
                        </Icon>
                    }
                    fullSymbol={
                        <Icon className={STYLES.starIconFull} fontSize="large">
                            star
                        </Icon>
                    }
                    fractions={2}
                />
            </CardContent>
        </Card>
    )
}

export default Movie
