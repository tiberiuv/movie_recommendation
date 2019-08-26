/* eslint-disable react-hooks/exhaustive-deps */
import {Route} from 'react-router-dom'
import React, {useEffect} from 'react'
import {CircularProgress} from '@material-ui/core'

import {Home} from './components/Pages'
import Login from './components/Login'
import Movie from './components/Movie'
import connect from './connectRefetch'
import CONFIG from './config'
import {setToken, getToken} from './components/Auth'

const MainRoutes = ({sessionFetch}) => {
    useEffect(() => {
        if (!getToken()) {
            sessionFetch()
        }
    }, [])

    return !!getToken() ? (
        <React.Fragment>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/movies" component={Movie} />
        </React.Fragment>
    ) : (
        <CircularProgress className="root" color="primary" />
    )
}

const withFetchers = connect(() => ({
    sessionFetch: cb => ({
        session: {
            url: `${CONFIG.gatewayApi}/session`,
            then: token => setToken(token) && console.log(token) && cb,
        },
    }),
}))

export default withFetchers(MainRoutes)
