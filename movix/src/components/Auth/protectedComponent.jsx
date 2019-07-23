import React, {withHistory} from 'react'
import {withRouter} from 'react-router-dom'
import {getSessionLevel} from './index'
import {CircularProgress} from '@material-ui/core'

import {CONFIG} from '../../config'
import Login from '../Login'
import {setToken} from './index'
import connect from '../../connectRefetch'

const isAllowedToView = () => {}

export const withProtected = WrappedComponent => props => {
    const sessionLevel = getSessionLevel()
    if (props.authRequired) {
        return sessionLevel === 'authenticated' ? (
            <WrappedComponent {...props} />
        ) : (
            <Login component={WrappedComponent} />
        )
    }
    return sessionLevel !== 'sessionOnly' ? <WrappedComponent {...props} /> : getSession(() => <WrappedComponent {...props}/> && <CircularProgress color="primary" />
}

const connectedFetchers = connect((Component) => ({
    getSession: (cb) => ({
        fetchSession: {
            url: `${CONFIG.authApi}/session`,
            then: token => setToken(token) && cb,
        }
    }),
}))

export default withHistory(withProtected)
