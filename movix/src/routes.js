/* eslint-disable react-hooks/exhaustive-deps */
import {Route, Switch} from 'react-router-dom'
import React, {useEffect} from 'react'
import {CircularProgress} from '@material-ui/core'

import {Home} from './components/Pages'
import Login from './components/Login'
import Movie from './components/Movie'
import connect from './connectRefetch'
import CONFIG from './config'
import {setToken, getToken} from './components/Auth'
import NotFound from './components/NotFound.jsx'

const MainRoutes = ({sessionFetch}) => {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/recommendations" render={props => <Home recommendations={true} {...props} />} />
            <Route path="/login" component={Login} />
            <Route path="/movies" component={Movie} />
            <Route component={NotFound} />
        </Switch>
    )
}

export default MainRoutes
