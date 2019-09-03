import STYLES from './index.styl'

import React, {useState} from 'react'
import withInfiniteScroll from '../InfiniteScroll'
import {Popper, CircularProgress} from '@material-ui/core'

import Movie from './movie'
import {getUser} from '../Auth'
import MovieMore from '../Movie'
import connect from '../../connectRefetch'
import CONFIG from '../../config'

export const MovieList = ({
    movies,
    openMovies,
    isLoading,
    handleClickMovie,
    rateMovieFetch,
    userRatings,
    ratings,
    onRateMovie,
}) => {
    const handleRatingChange = (rating, movieId) => {
        rateMovieFetch({rating, movieId}, onRateMovie)
    }
    const isOpen = id => openMovies.has(id)

    return (
        <div className={STYLES.container}>
            {movies
                .filter(movie => !!movie.posterUrl)
                .map(movie => (
                    <React.Fragment key={movie._id}>
                        <Movie
                            title={movie.title}
                            genres={movie.genres}
                            posterUrl={movie.posterUrl}
                            summary={movie.summary}
                            cast={movie.castMembers}
                            rating={ratings && ratings.find(x => x.movieId === movie.movieId)}
                            prediction={movie.rating}
                            handleRatingChange={rating => handleRatingChange(rating, movie.movieId)}
                        />
                        <Popper id={movie.movieId} open={isOpen(movie.movieId)}>
                            <MovieMore />
                            <h1> STUFF </h1>
                        </Popper>
                    </React.Fragment>
                ))}
            {isLoading && (
                <div>
                    <CircularProgress className={STYLES.loading} color="primary" />
                </div>
            )}
        </div>
    )
}

const withFetchers = connect(() => {
    const uri = `${CONFIG.userApi}/ratings/${getUser()}`
    return {
        rateMovieFetch: (body, cb) => ({
            rated: {
                url: uri,
                method: 'POST',
                force: true,
                body: JSON.stringify(body),
                then: cb,
            },
        }),
    }
})

export default withInfiniteScroll(withFetchers(MovieList))
