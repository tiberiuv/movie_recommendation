import React from 'react'
import {connect} from 'react-refetch'
import {withRouter} from 'react-router-dom'
import {STYLES} from './index.styl'

export class Movie extends React.Component { 

    render() {
        return (
            <div className={STYLES.container}>
                <h1>{this.props}</h1>
            </div>
            
        )
    }
}

const withFetchers = connect(() => ({
    getMovie: () => ({
        movieFetch: {
            url: `${CONFIG.moviesApi}${this.props.history.location}`,
            method: 'GET',
            force: true,
            refreshing: true,
        }
    })
}))

export default withRouter(withFetchers(Movie))