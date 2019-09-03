import React, {Component, useEffect} from 'react'
import Navbar from './components/Navbar/index'
import connect from './connectRefetch'
import CONFIG from './config'
import {setToken, getToken} from './components/Auth'
import MainRoutes from './routes'

export const App = ({sessionFetch}) => {
    useEffect(() => {
        if (!getToken()) {
            sessionFetch()
        }
    }, [])

    return (
        !!getToken() && (
            <div className="root">
                <Navbar />
                <MainRoutes />
            </div>
        )
    )
}

const withFetchers = connect(() => ({
    sessionFetch: cb => ({
        session: {
            url: `${CONFIG.gatewayApi}/session`,
            then: setToken,
        },
    }),
}))

export default withFetchers(App)
