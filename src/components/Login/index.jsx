import STYLES from './index.styl'
import React, { Component } from 'react'
import {FormControl, FormGroup, ControlLabel, Button, HelpBlock} from 'react-bootstrap'
import {Enhancer, connect} from 'react-refetch'

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
        if(item == 'email') {return this.isValidEmail(value)}
        else { return this.isValidPassword(value)}
    }

    isValidEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(String(email).toLowerCase()) ? 'success' : 'error'
    }

    isValidPassword = (password) => {
        if(password.length <= 5) { return 'error'}
        else if(password.length < 10) { return 'warning'}
        else return 'success'
    }

    doLogin = (e) => {
        e.preventDefault()
        const {login, fetchLogin} = this.props
        const {email, password} = this.state

        login({email: email.value, password: password.value})
        console.log(login)
        console.log(fetchLogin)
    }
    doRegister = (e) => {
        e.preventDefault()
        const {signUp, fetchSignUp} = this.props
        const {email, password} = this.state
        
        signUp({email: email.value, password: password.value})
    }
    isValid = (item) => {
        return item.changed &&  item.validation == 'success'
    }
    render() {
        const{email, password} = this.state
        const LoginButton = () => (
            <Button type="submit" disabled={!(this.isValid(email) && this.isValid(password))} onClick={this.doLogin}> Login </Button>
        )
        const RegisterButton = () => (
            <Button type="submit" disabled={!(this.isValid(email) && this.isValid(password))} onClick={this.doRegister}> Register </Button>
        )
        
        return (
            <div className={STYLES.root}>
                <form className={STYLES.root}>
                    <FormGroup controlId="1" validationState={!email.changed ? 'success' : email.validation}>
                        <ControlLabel> Email </ControlLabel> 
                        <FormControl 
                            type="text" 
                            values={this.state.email}
                            placeholder="Email"
                            name="email"
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback />
                        {email.validation != 'success' && <HelpBlock >Not a valid email</HelpBlock>}
                        
                    </FormGroup>
                    <FormGroup controlId="2" validationState={!password.changed ? 'success' : password.validation}>
                        <ControlLabel> Password </ControlLabel> 
                        <FormControl 
                            type="password" 
                            values={this.state.password}
                            placeholder="Password"
                            name="password"
                            onChange={this.handleChange}
                        />
                        <FormControl.Feedback />
                        {password.validation != 'success'&& <HelpBlock >Password must be longer than 10</HelpBlock>}
                    </FormGroup>
                    <LoginButton/>
                    <RegisterButton/>
                </form>
            </div>
            
        )
    }
}

const fetchers = connect(() => ({
    signUp: (body) => ({
        fetchSignUp: {
            url: `http://localhost:8081/signup`,
            method: 'POST',
            body: JSON.stringify(body),
        }
    }),
    login: (body) => ({
        fetchLogin: {
            url: `http://localhost:8081/login`,
            method: 'POST',
            body: JSON.stringify(body)
        }
    })
}))
export default fetchers(Login)
// type FetchProps = {
//     fetchTask: PromiseStateProp<TaskConfigResource>,
//     checksFetch: PromiseStateProp<Array<CheckConfigResource>>,
//     updateTask: TaskConfigResource => void,
//     deleteTask: (cb: () => *) => *,
// }

// export const addFetchers: Enhancer<OwnProps, FetchProps> = connect(({task, onUpdate}: OwnProps) => ({
//     fetchTask: {
//         url: `${config.apiV4}/config/tasks/${task.id || ''}`,
//     },
//     deleteTask: cb => ({
//         delete: {
//             refreshing: true,
//             url: `${config.apiV4}/config/tasks/${task.id || ''}`,
//             method: 'POST',
//             body: JSON.stringify({
//                 is_deleted: true,
//             }),
//             then: cb,
//         },
//     }),
//     updateTask: (body: TaskConfigResource) => ({
//         fetchTask: {
//             url: `${config.apiV4}/config/tasks/${task.id || ''}`,
//             method: 'POST',
//             body: JSON.stringify(body),
//             refreshing: true,
//             then: () => onUpdate(),
//         },
//     }),
// }))