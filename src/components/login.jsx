import React, { Component } from 'react'
import {FormControl, FormGroup, ControlLabel, Button} from 'react-bootstrap'
export class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
        }
    }

    changeEmail = ({target: {value}}) => {
        this.setState({
            email: value
        })
    }

    changePass = ({target: {value}}) => {
        this.setState({
            password: value
        })
    }

    validateEmail = () => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (re.test(String(this.state.email).toLowerCase())){
            return 'success'
        }
        return 'error'
        // return re.test(String(this.state.email).toLowerCase()) ? 'success' : 'error'
    }

    validatePassword = () => {
        return this.state.password.length >= 8 ? 'success' : 'warning'
    }

    doLogin = () => {
        const apiBase = 'http://localhost:4000/api/'

        return (
            <h2>
                Logged in
            </h2>
        )
    }
    doRegister = () => {
        const apiBase = 'http://localhost:4000/api/'

        return (
            <h2>
                Registered
            </h2>
        )
    }
    render() {

        return (
            <form>
                <FormGroup controlId="1" validationState={this.validateEmail}>
                    <ControlLabel> Email </ControlLabel> 
                    <FormControl 
                        type="text" 
                        values={this.state.email}
                        placeholder="Email"
                        onChange={this.changeEmail}
                    />
                </FormGroup>
                <FormGroup controlId="2" validationState={this.validatePassword}>
                    <ControlLabel> Password </ControlLabel> 
                    <FormControl 
                        type="password" 
                        values={this.state.password}
                        placeholder="password"
                        onChange={this.changePass}
                    />
                </FormGroup>
                <Button type="submit" onSubmit={this.doLogin}> Login </Button>
                <Button type="submit" onSubmit={this.doRegister}> Register </Button>
            </form>
        )
    }
}

export default Login