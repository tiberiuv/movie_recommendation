import STYLES from './index.styl'
import React from 'react'
import {withRouter} from 'react-router-dom'
import Movie from './movie'
import withInfiniteScroll from '../InfiniteScroll'

export const MovieList = ({movies, history}) => {
    const handleOnClickMovie = (id) => {
        history.push(`/movies/${id}`)
    }

    return(
        <div className={STYLES.container}>
            {movies.map(movie => (
                <Movie 
                    key={movie.movieId}
                    title={movie.title}
                    genres={movie.genres}
                    posterUrl={movie.posterUrl}
                    onClick={() => handleOnClickMovie(movie.movieId)}
                />
            ))}
        </div>
    )
}

export default withRouter(withInfiniteScroll(MovieList))