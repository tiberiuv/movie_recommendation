import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import STYLES from './index.styl'
import {PrimaryNav, NavItem} from 'mineral-ui'
import {Link} from 'react-router-dom'

export const NavigationBar = () => (
    <PrimaryNav itemElement={Link}>
        <NavItem href='/'> Home </NavItem>
        <NavItem href='/login'> Login </NavItem>
        <NavItem href='/logout'> Logout </NavItem>
    </PrimaryNav>
)

export default NavigationBar
