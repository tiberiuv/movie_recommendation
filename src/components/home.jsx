import React, { Component } from 'react'
import Movie from './MovieList/movie'
import MovieList from './MovieList/index'
import STYLES from './home.styl'
export class Home extends Component {
    
    render() {
        return (
            <React.Fragment>
                <div className={STYLES.container}>
                    <MovieList/>
                </div>
            </React.Fragment>
        )
    }
}

export default Home