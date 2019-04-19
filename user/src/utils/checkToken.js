import jwt from 'jsonwebtoken'

const secret = ''

export const checkToken = async (req, res, next) => {

    let token = parseHeaders
    if (!token) {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        })
    }
    const verified = await jwt.verify(token, config.secret)
    if (!verified) {
        return res.json({
            success: false,
            message: 'Token is not valid',
        })
    }
    else {
        req.auth = true
        next()
    }
}

const parseHeaders = (req) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'] || null
    if (token) {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length)
        }
    }
    return token
}
