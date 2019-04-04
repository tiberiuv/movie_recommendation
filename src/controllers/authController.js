import argon from 'argon2'
import jwt from 'jsonwebtoken'
import User from '../models/usersModel'
import fs from 'fs'
import {sendError, sendSuccess, throwError, throwIf} from '../utils/errorHandling'
const privateKEY = fs.readFileSync(__dirname +'/../../keys/jwtRS512.key', 'utf8')

let signOptions = {
    issuer: 'authService',
    subject: '',
    audience: 'moviesWebsite',
    expiresIn: '24h',
    algorithm: 'RS512',
}

export const makePayload = (userId) => {
    return {id: userId}
}

export const signUp = async (req, res) => {
    try {
        if (!req.body.email && !req.body.password) throwError(400, 'Incorrect Request','Email or password is missing')()
        const {email, password} = req.body

        await User
            .findOne({email: email})
            .then(
                throwIf(r => r, 409, 'Incorrect data', 'Email already in use!'),
                throwError(500, 'Mongodb error')
            )
        const hashedPass = await argon
            .hash(password)
            .then(
                throwIf(r => !r, 500, 'Argon error'),
                throwError(500, 'Mongodb error')
            )

        const user = await User
            .create({email: email, password: hashedPass})
            .then(
                throwIf(r => !r, 500, 'Mongo error', 'User not created'), 
                throwError(500, 'Mongo error'))

        signOptions = {...signOptions, subject: email}

        const token = jwt.sign(makePayload(user._id), privateKEY, signOptions)
        if(!token) throwError(500, 'Jwt sign error', 'Something went wrong with signing the jwt')
        sendSuccess(res, 'User Created!')({token})
    } catch(err) {
        sendError(res)(err)
    }
}

export const logIn = async (req, res) => {
    try {
        if(!req.body.email && !req.body.password) throwError(400, 'Incorrect request', 'Email or password is missing')
        const {email = '', password = ''} = req.body

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

        var token = jwt.sign(makePayload(user._id), privateKEY, signOptions)
        sendSuccess(res, 'Authentication successful')(token)

    } catch (err) {
        sendError(res)(err)
    }
}