import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
import STYLES from './index.styl'

const NavigationBar = () => (
    <Navbar inverse collapseOnSelect staticTop className={STYLES.abc}>
        <Navbar.Header>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav>
                <LinkContainer to='/'>
                    <NavItem eventKey={1}>Home</NavItem>
                </LinkContainer>
                <LinkContainer to='/'>
                    <NavItem eventKey={2}>Link</NavItem>
                </LinkContainer>

                {/* <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
                    <MenuItem eventKey={3.1}>Action</MenuItem>
                    <MenuItem eventKey={3.2}>Another action</MenuItem>
                    <MenuItem eventKey={3.3}>Something else here</MenuItem>
                    <MenuItem divider />
                    <MenuItem eventKey={3.3}>Separated link</MenuItem>
                </NavDropdown> */}
            </Nav>
            <Nav pullRight>
                <LinkContainer to='/login'>
                    <NavItem eventKey={2}>Login</NavItem>
                </LinkContainer>
                <LinkContainer to='/logout'>
                    <NavItem eventKey={2}>Logout</NavItem>
                </LinkContainer>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
)

export default NavigationBar
