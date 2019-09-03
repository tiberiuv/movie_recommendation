import STYLES from './index.styl'

import React, {Component, useState} from 'react'
// import connect from '../../connectRefetch'
import {connect} from 'react-refetch'
import {Redirect} from 'react-router-dom'

import {TextField, Button} from '@material-ui/core'
import CONFIG from '../../config'
import {setToken, getToken} from '../Auth/index'

const initialState = {
    email: {
        value: '',
        validation: 'error',
        changed: false,
    },
    password: {
        value: '',
        validation: 'error',
        changed: false,
    },
}

export const Login = ({login, fetchLogin, signUp, fetchSignUp}) => {
    const [form, setForm] = useState(initialState)

    const handleChange = ({target}) => {
        const {name, value} = target
        const validation = validate(name, value)
        setForm({
            ...form,
            [name]: {value, validation, changed: true},
        })
    }

    const validate = (item, value) => {
        if (item === 'email') {
            return validateEmail(value)
        } else {
            return validatePassword(value)
        }
    }

    const validateEmail = email => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(email).toLowerCase()) ? 'success' : 'error'
    }

    const validatePassword = password => {
        if (password.length <= 4) {
            return 'error'
        } else if (password.length < 6) {
            return 'warning'
        } else return 'success'
    }

    const doLogin = async e => {
        e.preventDefault()

        login({email: form.email.value, password: form.password.value})
    }

    const doRegister = e => {
        e.preventDefault()

        signUp({email: form.email.value, password: form.password.value})
    }

    const isValid = item => !item.changed || item.validation === 'success'

    const isSubmitDisabled = () => !(form.email.validation === 'success' && form.password.validation === 'success')

    return (
        <div className={STYLES.container}>
            <form className={STYLES.form}>
                <TextField
                    name="email"
                    label="E-mail"
                    type="Email"
                    error={!isValid(form.email)}
                    value={form.email.value}
                    margin="normal"
                    required
                    onChange={handleChange}
                />
                <TextField
                    name="password"
                    label="Password"
                    type="Password"
                    error={!isValid(form.password)}
                    value={form.password.value}
                    margin="normal"
                    required
                    onChange={handleChange}
                />
                <div className={STYLES.submit}>
                    <Button
                        className={STYLES.button}
                        color="primary"
                        disabled={isSubmitDisabled()}
                        variant="contained"
                        onClick={doLogin}
                    >
                        Login
                    </Button>
                    <Button
                        className={STYLES.button}
                        color="primary"
                        disabled={isSubmitDisabled()}
                        variant="contained"
                        onClick={doRegister}
                    >
                        Register
                    </Button>
                </div>
                {fetchSignUp && fetchSignUp.fulfilled && fetchSignUp.value && <Redirect to="/" />}
                {fetchLogin && fetchLogin.fulfilled && fetchLogin.value && <Redirect to="/" />}
            </form>
        </div>
    )
}

const connectedFetchers = connect(() => ({
    signUp: body => ({
        fetchSignUp: {
            url: `${CONFIG.gatewayApi}/signup`,
            headers: {authorization: `${getToken()}`},
            method: 'POST',
            force: true,
            body: JSON.stringify(body),
            then: setToken,
        },
    }),
    login: body => ({
        fetchLogin: {
            url: `${CONFIG.gatewayApi}/login`,
            headers: {authorization: `${getToken()}`},
            method: 'POST',
            force: true,
            body: JSON.stringify(body),
            then: token => setToken(token),
        },
    }),
}))

export default connectedFetchers(Login)
