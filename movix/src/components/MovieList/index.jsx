import STYLES from './index.styl'
import React from 'react'
import Movie from './movie'
import MovieMore from '../Movie'
import withInfiniteScroll from '../InfiniteScroll'
import {Popper} from '@material-ui/core'

export const MovieList = ({movies, openMovies, handleClickMovie}) => {

    const isOpen = (id) => openMovies.has(id) 

    return(
        <div className={STYLES.container}>
            {movies
                .filter(movie => !!movie.posterUrl)
                .map(movie => (
                    <React.Fragment key={movie.movieId}>
                        <Movie
                            title={movie.title}
                            genres={movie.genres}
                            posterUrl={movie.posterUrl}
                            onClick={() => handleClickMovie(movie.movieId)}
                        />
                        <Popper id={movie.movieId} open={isOpen(movie.movieId)}>
                            <MovieMore />
                            <h1>STUFF</h1>
                        </Popper>
                    </React.Fragment>
                    
                ))}
        </div>
    )
}

export default withInfiniteScroll(MovieList)