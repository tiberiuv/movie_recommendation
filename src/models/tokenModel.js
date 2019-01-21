import mongoose from 'mongoose'
import User from './usersModel'
import validator from '../token/validator.js'

const TokenSchema = new Schema ({
    token: {
        type: String,
        unique: true,
        required: [true, 'Token is required!'],
        trim: true,
    },
    userId: {
        type: Schema.Types.ObjectId, ref: 'User'
    }
})