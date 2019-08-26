import mongoose, {Schema} from 'mongoose'
import validator from 'validator'

const UserSchema = new Schema ({
    email: {
        type: String,
        unique: true,
        // required: [true, 'Email is required!'],
        sparse: true,
        trim: true,
        validate: {
            validator(email) {
                return validator.isEmail(email)
            },
            message: '{VALUE} is not a valid email!',
        },
    },

    password: {
        type: String,
        // required: [true, 'Password is required!'],
        sparse: true,
        trim: true,
        minlength: [6, 'Password need to be longer!'],
    },

    lastAccess: {
        type: Date,
        default: Date.now
    },
})

export default mongoose.model('Users', UserSchema)
