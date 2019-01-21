import {Route} from 'react-router-dom'
import React from 'react'
import {Home, Login} from './components'

const MainRoutes = () => {
    return (
        <React.Fragment>
            <Route exact path='/' component={Home}/>
            <Route path='/login' component={Login}/>
        </React.Fragment>
    )
}

export default MainRoutes

