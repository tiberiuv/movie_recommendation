import React, { Component } from 'react'
import Movie from './MovieList/movie'
import MovieList from './MovieList/index'
import {connect} from 'react-refetch'
import CONFIG from '../config'

import STYLES from './home.styl'
export class Home extends Component {

    state = {
        query: {
            offset: 0,
            count: 20,
        },
        error: '',
        hasMore: true,
        movies: [],
    }
    
    componentWillMount = async () => {
        this.props.getMovies(this.state.query, this.injectState)
    }

    loadNextMovies = async () => {
        const {getMovies} = this.props
        const {query} = this.state

        const newOffSet = query.offset + query.count
        getMovies({...this.state.query, offset: newOffSet}, this.injectState)
        this.setState({
            query: {...query, offset: newOffSet},
        })
    }

    injectState = (nextMovies) => {
        const {movies} = this.state
        this.setState({movies: [...movies, ...nextMovies.data]})
    }

    render() {
        const {movies} = this.state
        const {moviesFetch} = this.props
        const isLoading = !!(moviesFetch && moviesFetch.pending)
        return (
            <React.Fragment>
                <div className={STYLES.container}>
                    {movies && movies.length ? (
                        <MovieList
                            movies={movies}
                            isLoading={isLoading}
                            onPaginatedSearch={() => this.loadNextMovies()}
                        />
                    ) : (
                        <h1>LOADING</h1>
                    )}
                    
                </div>
            </React.Fragment>
        )
    }
}

const withFetchers = connect(() => {
    const url = `${CONFIG.moviesApi}/movies/search`
    return({
        getMovies: (query, cb) => ({
            moviesFetch: {
                url: url,
                method: 'POST',
                body: JSON.stringify(query),
                then: cb,
                force: true,
            }
        })
    })
})

export default withFetchers(Home)