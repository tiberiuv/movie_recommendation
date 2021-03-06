import STYLES from './home.styl'

import React, {Component} from 'react'
import connect from '../../connectRefetch'
import {CircularProgress} from '@material-ui/core'

import CONFIG from '../../config'
import MovieList from '../MovieList/index'
import withProtected from '../Auth/protectedComponent'
import {getUser} from '../Auth'
import qs from 'query-string'
import {setToken, getToken} from '../Auth/index'

export class Home extends Component {
    defaultPagination = {offset: 0, count: 20}
    state = {
        query: {
            offset: 0,
            count: 20,
            term: '',
            recommendations: false,
        },
        error: '',
        hasMore: true,
        movies: [],
        openMovies: new Set(),
        ratings: [],
    }

    getSearchTerm = location => {
        return location.search.replace('?', '')
    }

    componentWillMount = () => {
        this.props.getMovies({...this.state.query, term: this.getSearchTerm(this.props.location)}, this.injectState)
    }

    componentDidUpdate = prevProps => {
        const oldTerm = this.getSearchTerm(prevProps.location)
        const newTerm = this.getSearchTerm(this.props.location)
        if (oldTerm !== newTerm) {
            this.setState({query: this.defaultPagination, movies: []}, () =>
                this.props.getMovies({...this.state.query, term: newTerm}, this.injectState),
            )
        }
        if (prevProps.recommendations !== this.props.recommendations) {
            this.setState(
                {query: this.defaultPagination, movies: [], recommendations: this.props.recommendations},
                () =>
                    this.props.getMovies(
                        {...this.state.query, term: newTerm, recommendations: this.props.recommendations},
                        this.injectState,
                    ),
            )
        }
    }

    loadNextMovies = () => {
        const {getMovies, location, recommendations} = this.props
        const {query} = this.state

        const newOffSet = query.offset + query.count
        getMovies(
            {
                ...this.state.query,
                offset: newOffSet,
                term: this.getSearchTerm(location),
                recommendations,
            },
            this.injectState,
        )
        this.setState({
            query: {
                ...query,
                offset: newOffSet,
            },
        })
    }

    injectState = nextMovies => {
        const {movies} = this.state
        this.setState({
            movies: [...movies, ...nextMovies],
        })
    }

    handleClickMovie = id => {
        const isMovieOpen = this.state.openMovies.has(id)
        const newOpen = new Set([...this.state.openMovies])
        if (isMovieOpen) {
            newOpen.delete(id)
        } else {
            newOpen.add(id)
        }
        this.setState({
            openMovies: new Set(newOpen),
        })
    }

    render() {
        const {movies, openMovies} = this.state
        const {moviesFetch, movieRatingsFetch, userRatings} = this.props
        const isLoading = moviesFetch && (moviesFetch.pending || moviesFetch.refreshing)
        const ratings = userRatings && userRatings.fulfilled && userRatings.value
        return (
            <React.Fragment>
                <div className={STYLES.container}>
                    {movies && movies.length ? (
                        <MovieList
                            movies={movies}
                            openMovies={openMovies}
                            handleClickMovie={this.handleClickMovie}
                            isLoading={isLoading}
                            onPaginatedSearch={() => this.loadNextMovies()}
                            refreshing={moviesFetch && moviesFetch.refreshing}
                            onRateMovie={movieRatingsFetch}
                            ratings={ratings}
                        />
                    ) : (
                        <CircularProgress className={STYLES.progress} color="primary" />
                    )}
                </div>
            </React.Fragment>
        )
    }
}

const withFetchers = connect(() => ({
    getMovies: (query, cb) => ({
        moviesFetch: {
            url: `${CONFIG.movieApi}/search`,
            headers: {authorization: `${getToken()}`},
            method: 'POST',
            body: JSON.stringify(query),
            then: cb,
            force: true,
        },
    }),
    movieRatingsFetch: () => ({
        userRatings: {
            url: `${CONFIG.userApi}/ratings/${getUser()}`,
            force: true,
            refreshing: true,
        },
    }),
    userRatings: `${CONFIG.userApi}/ratings/${getUser()}`,
}))

export default withFetchers(Home)
