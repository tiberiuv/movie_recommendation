import User from '../models/usersModel'
import bcrypt from 'bcryptjs'
import config from '../conf'
import jwt from 'jsonwebtoken'

export function signUp (req, res, next) {
    try {
        const hashedPass = bcrypt.hashSync(req.body.password)
        const user = User.create({...req.body, password: hashedPass}, (err, user) => {
            if (err) return res.status(500).send("There was a problem registering the user.") 
            // create a token
            var token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            return res.status(200).json({user: user, auth: true, token: token}) 
        })
    } 
        catch (e) {
        return res.status(500).json(e)
    }
}

export function logIn(req, res, next)  {
    let username = req.body.username;
    let password = req.body.password;
    // For the given username fetch user from DB
    let mockedUsername = 'admin';
    let mockedPassword = 'password';

    if (username && password) {
        if (username === mockedUsername && password === mockedPassword) {
        let token = jwt.sign(
            {username: username},
            config.secret,
            { expiresIn: '24h'} // expires in 24 hours
        )
        // return the JWT token for the future API calls
        res.json({
            success: true,
            message: 'Authentication successful!',
            token: token
        })
        } else {
            res.send(403).json({
                success: false,
                message: 'Incorrect username or password'
        })
        }
    } else {
        res.send(400).json({
            success: false,
            message: 'Authentication failed! Please check the request'
        })
    }
}