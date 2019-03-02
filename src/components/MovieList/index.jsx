import STYLES from './index.styl'
import React, {Component} from 'react'
import Movie from './movie'
import {withRouter} from 'react-router-dom'
import {Enhancer, connect} from 'react-refetch'
import CONFIG from '../../config'

export class MovieList extends Component {
    state = {
        query: {
            offset: 0,
            count: 20,
        }
    }
    handleOnClickMovie = (id) => {
        this.props.history.push(`/movies/${id}`)
    }

    componentDidMount = () => {
        this.props.getMovies(this.state)
    }

    render() {
        const {moviesFetch} = this.props

        return moviesFetch && moviesFetch.pending ? (
            <h1>LOADING</h1>
        ) : (
            <div className={STYLES.container}>
                {moviesFetch && moviesFetch.fulfilled && moviesFetch.value &&
                    moviesFetch.value.data.map(movie => (
                        <Movie 
                            key={movie.movieId}
                            title={movie.title}
                            genres={movie.genres}
                            posterUrl={movie.posterUrl}
                            onClick={() => this.handleOnClickMovie(movie.movieId)}
                        />
                    ))
                }
            </div>
        )
    }
}

const withFetchers = connect(() => ({
    getMovies: (query) => ({
        moviesFetch: {
            url: `${CONFIG.moviesApi}/movies/search`,
            method: 'POST',
            body: JSON.stringify(query),
            force: true,
        }
    })
}))

export default withRouter(withFetchers(MovieList))