import React, { Component } from 'react'

export class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
        }
    }

    changeEmail = (event, newValue) => {
        this.setState({
            email: newValue
        })
    }

    changePass = (event, newValue) => {
        this.setState({
            password: newValue
        })
    }

    handleClick = (event) => {
        const apiBase = 'http://localhost:4000/api/'

        return (
            <h2>
                Logged in
            </h2>
        )
    }

    render() {
        return (
            <h1></h1>
        )
    }
}

export default Login