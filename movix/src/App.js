import React, { Component } from 'react'
import Navbar from './components/Navbar/index'
import MainRoutes from './routes'
export class App extends Component {
    render() {

        return (
            <div className='root' >
                <Navbar/>
                <MainRoutes/>
            </div>
        )
    }
}

export default App