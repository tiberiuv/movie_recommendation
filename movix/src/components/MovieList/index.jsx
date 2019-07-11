import STYLES from './index.styl'
import React, {useState} from 'react'
import Movie from './movie'
import MovieMore from '../Movie'
import connect from '../../connectRefetch'
import withInfiniteScroll from '../InfiniteScroll'
import {Popper, CircularProgress} from '@material-ui/core'
import CONFIG from '../../config'

export const MovieList = ({movies, openMovies, isLoading, handleClickMovie}) => {
    const isOpen = id => openMovies.has(id)
    return (
        <div className={STYLES.container}>
            {movies
                .filter(movie => !!movie.posterUrl)
                .map(movie => (
                    <React.Fragment key={movie.movieId}>
                        <Movie
                            title={movie.title}
                            genres={movie.genres}
                            posterUrl={movie.posterUrl}
                            summary={movie.summary}
                            cast={movie.castMembers}
                            onClick={() => handleClickMovie(movie.movieId)}
                        />
                        <Popper id={movie.movieId} open={isOpen(movie.movieId)}>
                            <MovieMore />
                            <h1> STUFF </h1>
                        </Popper>
                    </React.Fragment>
                ))}
            {isLoading && <CircularProgress className={STYLES.progress} color="primary" />}
        </div>
    )
}

export default withInfiniteScroll(MovieList)
