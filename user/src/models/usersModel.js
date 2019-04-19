import mongoose, {Schema} from 'mongoose'
import validator from 'validator'

const UserSchema = new Schema ({
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required!'],
        trim: true,
        validate: {
            validator(email) {
                return validator.isEmail(email);
            },
            message: '{VALUE} is not a valid email!',
        },
    },
    first_name: {
        type: String,
        required: [true, 'First name is required!'],
        trim: 'true',
    },
    last_name: {
        type: String,
        required: [true, 'Last name is required!'],
        trim: 'true',
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        trim: true,
        minlength: [6, 'Password need to be longer!'],
        validate: {
            validator(password) {
                return passwordReg.test(password);
            },
            message: '{VALUE} is not a valid password!',
        },
    }
})

export default mongoose.model('User', UserSchema);
