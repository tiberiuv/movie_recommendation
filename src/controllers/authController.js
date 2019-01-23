import User from '../models/usersModel'
import bcrypt from 'bcryptjs'
import config from '../conf'
import jwt from 'jsonwebtoken'

export const signUp = async (req, res, next) => {
    const {email, password} = req.body
    const hashedPass = await bcrypt.hash(password, 13)
    const _user = await User.findOne({email: email})
    if(_user) return res.status(409).json({success: false, message: 'Email already taken!'})

    const user = await User.create({email: email, password: hashedPass})
    var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: '24h' // expires in 24 hours
    })
    return res.status(200).json({success: true, user: user, token: token}) 
}

export const logIn = async (req, res, next) => {
    const {email = '', password = ''} = req.body

    const user = await User.findOne({email: email})

    if(!user) {
        return res.status(403).json({
            success: false,
            message: 'Incorrect email'
        })
    } 

    const valid = await bcrypt.compare(password, user.password)

    if(!valid) {
        return res.status(403).json({
            success: false,
            message: 'Incorrect password'
        })
    }

    const token = jwt.sign({email: email}, config.secret, { expiresIn: '24h'})
    return res.status(200).json({
        success: true,
        message: 'Authentication successful!',
        token: token,
    })
}