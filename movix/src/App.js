import React, {Component} from 'react'
import Navbar from './components/Navbar/index'

import MainRoutes from './routes'

export const App = () => (
    <div className="root">
        <Navbar />
        <MainRoutes />
    </div>
)

export default App
