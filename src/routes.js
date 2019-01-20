import {BrowserRouter as Router, Route} from 'react-router-dom'
import React from 'react'
import {Home, Login} from './components'

const MainRoutes = () => {
    return (
        <Router>
            <Route exact path='/' component={Home}/>
            <Route path='/login' component={Login}/>
        </Router>
    )
}

export default MainRoutes

