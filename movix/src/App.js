import React, {Component} from 'react'
import Navbar from './components/Navbar/index'

import MainRoutes from './routes'

export const App = ({sessionFetch}) => (
    <div className="root">
        <Navbar />
        <MainRoutes />
    </div>
)

export default App
