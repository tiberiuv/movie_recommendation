import protectedComponent from './protectedComponent'
import jwt from 'jsonwebtoken'
import config from '../../config'

// const sessionLevel = {
//     0: 'noSession',
//     1: 'authenticated',
//     2: 'sessionOnly'
// }

const getSessionLevel = () => {
    const publicKey = config.get('publicKey')
    const token = getToken()
    const decodedJwt = jwt.verify(token, publicKey)
    console.log(decodedJwt)
    return decodedJwt.get('authenticated', 'noSession') ? 'authenticated' : 'sessionOnly'
}

export const setToken = jwtToken => {
    localStorage.setItem('jwt', jwtToken)
}

export const getToken = () => {
    return localStorage.getItem('jwt')
}

export const logout = () => {
    return localStorage.removeItem('jwt')
}

export const checkToken = () => {
    return getToken() ? true : false
}

export default protectedComponent
