import React, {withHistory} from 'react'
import {withRouter} from 'react-router-dom'
import {getSessionLevel} from './index'
import {CircularProgress} from '@material-ui/core'
import {connect} from 'react-refetch'

import CONFIG from '../../config'
import Login from '../Login'
import {setToken} from './index'
// import connect from '../../connectRefetch'

// export const withProtected = WrappedComponent => {
//     const Protected = ({getSession, ...props}) => {
//         const sessionLevel = getSessionLevel()
//         const cb = () => <WrappedComponent {...props} />

//         if (props.authRequired) {
//             return sessionLevel === 'authenticated' ? <WrappedComponent {...props} /> : <Login />
//         }
//         if (sessionLevel === 'sessionOnly') {
//             return <WrappedComponent {...props} />
//         } else {
//             getSession(cb)
//             return <CircularProgress color="primary" />
//         }
//     }
//     return connectedFetchers(Protected)
// }

// const connectedFetchers = connect(() => ({
//     getSession: cb => ({
//         fetchSession: {
//             url: `${CONFIG.gatewayApi}/session`,
//             then: token => setToken(token) && console.log(token) && cb,
//         },
//     }),
// }))

// export default withProtected
