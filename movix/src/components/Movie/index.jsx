import React from 'react'
import {connect} from 'react-refetch'
import {withRouter} from 'react-router-dom'
import STYLES from './index.styl'
import CONFIG from '../../config'

const Movie = ({movieFetch, getMovie, history}) => {
    return (
        <div className={STYLES.container}>
            {movieFetch && movieFetch.fulfilled && movieFetch.value && <h1>{movieFetch.value.title}</h1>}
            <h1>afefa</h1>
        </div>
    )
}

const connectFetchers = connect(({location}) => {
    const url = `${CONFIG.movieApi}${location.pathname.replace('/movies', '')}`
    return {
        movieFetch: url,
        getMovie: () => ({
            movieFetch: {
                url: url,
                method: 'GET',
                force: true,
                refreshing: true,
            },
        }),
    }
})

export default withRouter(connectFetchers(Movie))
