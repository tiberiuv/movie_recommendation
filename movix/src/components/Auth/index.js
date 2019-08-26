import jwt from 'jsonwebtoken'
import CONFIG from '../../config'

// const sessionLevel = {
//     0: 'noSession',
//     1: 'authenticated',
//     2: 'sessionOnly'
// }

export const getSessionLevel = () => {
    // const publicKey = unescape(encodeURIComponent(CONFIG['publicKey']))
    const publicKey = decodeURIComponent(escape(CONFIG['publicKey']))
    const token = getToken()

    console.log(token)
    console.log(publicKey)

    try {
        const decodedJwt = jwt.verify(token, publicKey, {algorithm: 'RS512'})

        console.log(decodedJwt)
        return decodedJwt.get('authenticated', 'noSession') ? 'authenticated' : 'sessionOnly'
    } catch (err) {
        console.log(err)
        if (!token) return 'noSession'
    }
}

export const setToken = jwtToken => {
    localStorage.setItem('jwt', jwtToken)
}

export const getToken = () => {
    return localStorage.getItem('jwt')
}

export const getUser = () => {
    const token = getToken()
    console.log(token)
    const parsedJwt = jwt.decode(token, {algorithm: 'RS512'})
    console.log(parsedJwt)
    return parsedJwt['id']
}

export const logout = () => {
    const loggedOutToken = getToken()
    delete loggedOutToken['authenticated']
    localStorage.setItem('jwt', loggedOutToken)
}

export const checkToken = () => {
    return getToken() ? true : false
}
