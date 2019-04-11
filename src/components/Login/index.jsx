import STYLES from './index.styl'
import React, { Component } from 'react'
import connect from '../../connectRefetch'
import {TextField, Button} from '@material-ui/core'
import CONFIG from '../../config'
import {setToken} from '../Auth/index'

const initialState = {
    email: {
        value: '',
        validation: 'success',
        changed: false,
    },
    password: {
        value: '',
        validation: 'success',
        changed: false,
    },
}

export class Login extends Component {
    state = initialState

    handleChange = ({target}) => {
        const {name, value} = target
        const validation = this.validate(name, value)
        this.setState({
            [name]: {value, validation, changed: true}
        })
    }

    validate = (item, value) => {
        if(item === 'email') {return this.isValidEmail(value)}
        else { return this.isValidPassword(value)}
    }

    isValidEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(email).toLowerCase()) ? 'success' : 'error'
    }

    isValidPassword = (password) => {
        if(password.length <= 4) { return 'error'}
        else if(password.length < 6) { return 'warning'}
        else return 'success'
    }

    doLogin = async (e) => {
        e.preventDefault()
        const {login} = this.props
        const {email, password} = this.state

        login({email: email.value, password: password.value})
    }

    doRegister = (e) => {
        e.preventDefault()
        const {signUp} = this.props
        const {email, password} = this.state
        
        signUp({email: email.value, password: password.value})
    }

    isValid = (item) => {
        return item.changed && item.validation == 'success'
    }

    render() {
        const{email, password} = this.state
        const{fetchLogin, fetchSignUp} = this.props
        
        return (
            <div className={STYLES.container}>
                <form className={STYLES.form}>
                    <TextField
                        name='email'
                        label='E-mail'
                        value={email.value}
                        margin='normal'
                        onChange={this.handleChange}
                    />
                    <TextField
                        name='password'
                        label='Password'
                        value={password.value}
                        margin='normal'
                        onChange={this.handleChange}
                    />
                    <div className={STYLES.submit}>
                        <Button className={STYLES.button} color='primary' variant='contained' onClick={this.doLogin}>
                            Login
                        </Button>
                        <Button className={STYLES.button} color='primary' variant='contained' onClick={this.doRegister}>
                            Register
                        </Button>
                    </div>
                    {fetchSignUp && fetchSignUp.fulfilled && fetchSignUp.value 
                    && <span> Successful register </span> }
                    {fetchLogin && fetchLogin.fulfilled && fetchLogin.value
                    && <span> Successful logged-in </span> }
                </form>
            </div>
        )
    }
}

const connectedFetchers = connect(() => ({
    signUp: (body) => ({
        fetchSignUp: {
            url: `${CONFIG.authApi}/signup`,
            method: 'POST',
            force: true,
            body: JSON.stringify(body),
            then: token => setToken(token),
        }
    }),
    login: (body) => ({
        fetchLogin: {
            url: `${CONFIG.authApi}/login`,
            method: 'POST',
            force: true,
            body: JSON.stringify(body),
            then: token => setToken(token),
        }
    })
}))

export default connectedFetchers(Login)
