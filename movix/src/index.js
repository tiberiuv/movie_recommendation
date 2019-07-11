import React from 'react'
import {render} from 'react-dom'
import App from './App'
import './index.css'
import * as serviceWorker from './serviceWorker'
import {BrowserRouter} from 'react-router-dom'
import "core-js/stable";
import "regenerator-runtime/runtime";

render(
    (
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    )
    ,document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
