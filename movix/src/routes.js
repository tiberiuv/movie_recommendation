import {Route} from 'react-router-dom'
import React from 'react'
import {Home} from './components/Pages'
import Login from './components/Login'
import Movie from './components/Movie'

const MainRoutes = () => {
    return (
        <React.Fragment>
            <Route exact path='/' component={Home}/>
            <Route path='/login' component={Login}/>
            <Route path='/movies' component={Movie}/>
        </React.Fragment>
    )
}

export default MainRoutes

