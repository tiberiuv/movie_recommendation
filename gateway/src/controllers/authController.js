import argon from 'argon2'
import jwt from 'jsonwebtoken'
import User from '../models/usersModel'
import fs from 'fs'
import {sendError, sendSuccess, throwError, throwIf} from '../utils/errorHandling'

const privateKEY = fs.readFileSync(__dirname +'/../../keys/jwtRS512.key', 'utf8')
const publicKey = fs.readFileSync(__dirname +'/../../keys/jwtRS512.key.pub', 'utf8')
console.log(publicKey)

const SIGN_ALGORITHM = 'RS512'
let signOptions = {
    issuer: 'gateway',
    subject: '',
    audience: 'moviesWebsite',
    // expiresIn: '24h',
    algorithm: SIGN_ALGORITHM,
}

export const makePayloadAuthenticated = (userId) => ({id: userId, authenticated: true})
export const makePayload = (userId) => ({id: userId})

export const health = (_, res) => {
    return sendSuccess(res)('Alive!')
}

export const signUp = async (req, res) => {
    try {
        const {email, password} = req.body
        const currentToken = req.headers['authorization']
        if (!email || !password)
            throwError(400, 'Incorrect Request','Email or password is missing')()

        if(currentToken) {
            console.log('current token', currentToken)
            mergeSession(currentToken, email, password, res)
        } else {
            const [, hashedPass] = await Promise.all([
                await User
                    .findOne({email: email})
                    .then(
                        throwIf(r => r, 409, 'Incorrect data', 'Email already in use!'),
                        throwError(500, 'Mongodb error')
                    ),
                await argon
                    .hash(password)
                    .then(
                        throwIf(r => !r, 500, 'Argon error'),
                        throwError(500, 'Mongodb error')
                    )
            ])
            const user = await User
                .create({email: email, password: hashedPass})
                .then(
                    throwIf(r => !r, 500, 'Mongo error', 'User not created'),
                    throwError(500, 'Mongo error')
                )

            signOptions = {...signOptions, subject: email}

            const token = jwt.sign(makePayloadAuthenticated(user._id), privateKEY, signOptions)
            if(!token) throwError(500, 'Jwt sign error', 'Something went wrong with signing the jwt')
            sendSuccess(res)(token)
        }
    } catch(err) {
        console.log(err)
        sendError(res)(err)
    }
}

export const logIn = async (req, res) => {
    try {
        const {email, password} = req.body
        if(!email || !password)
            throwError(400, 'Incorrect request', 'Email or password is missing')()

        const user = await User
            .findOne({email: email})
            .then(
                throwIf(r => !r, 403, 'Not found', 'Email not found'),
                throwError(500, 'Mongo error'),
            )

        await argon
            .verify(user.password, password)
            .then(
                throwIf(r => !r, 403, 'Incorrect', 'Password is incorrect'),
                throwError(500, 'Argon error'),
            )
        var token = jwt.sign(makePayloadAuthenticated(user._id), privateKEY, signOptions)
        sendSuccess(res)(token)

    } catch (err) {
        sendError(res)(err)
    }
}

const mergeSession = async (token, email, password, res) => {
    try {
        const verifiedToken = verifyJWT(token)
        const hashedPassword = await argon
            .hash(password)
            .then(
                throwIf(r => !r, 500, 'Argon error'),
                throwError(500, 'Mongodb error')
            )
        await User
            .findById(verifiedToken.id)
            .updateOne({
                $set: {email, password: hashedPassword},
            })
            .then(
                throwIf(r => !r, 404, 'Not found', 'User not found'),
                throwError(500, 'Mongoose error')
            )
        sendSuccess(res)(token)
    } catch (err) {
        sendError(res)(err)
    }
}

const verifyJWT = (token) => {
    try{
        console.log(token)
        const decryptedToken = jwt.verify(token, publicKey, {algorithm: SIGN_ALGORITHM})
        return decryptedToken
    } catch (err) {
        console.log(err)
        throwError(401, 'Invalid token')
    }
}


export const createSession = async (req, res) => {
    try {
        const user = await User.create({})
        const token = jwt.sign(makePayload(user._id), privateKEY, signOptions)
        console.log(token)
        sendSuccess(res)(token)
    } catch (err) {
        console.log(err)
        sendError(res)(err)
    }
}
