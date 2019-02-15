import argon from 'argon2'
import jwt from 'jsonwebtoken'
import User from '../models/usersModel'
import fs from 'fs'

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
    const {email, password} = req.body

    const _user = await User.findOne({email: email})
    if(_user) return res.status(409).json({success: false, message: 'Email already taken!'})

    const hashedPass = await argon.hash(password)
    const user = await User.create({email: email, password: hashedPass})

    signOptions = {...signOptions, subject: email}

    var token = await jwt.sign(makePayload(user._id), privateKEY, signOptions)

    return res.status(200).json({success: true, user: user, token: token}) 
}

export const logIn = async (req, res) => {
    const {email = '', password = ''} = req.body

    const user = await User.findOne({email: email})

    if(!user) {
        return res.status(403).json({
            success: false,
            message: 'Incorrect email'
        })
    } 

    const valid = await argon.verify(user.password, password)

    if(!valid) {
        return res.status(403).json({
            success: false,
            message: 'Incorrect password'
        })
    }

    var token = await jwt.sign(makePayload(user._id), privateKEY, signOptions)
    if(!token) {
        return res.status(500).json({
            sucess: false,
            message: token
        })
    }
    return res.status(200).json({
        success: true,
        message: 'Authentication successful!',
        token: token,
    })
}