import React from 'react'
import STYLES from './index.styl'
import {withRouter} from 'react-router-dom'
import {
    AppBar, Toolbar, IconButton, Typography,
    InputBase, MenuItem, Menu,
} from '@material-ui/core'
import {Search, More, MenuRounded} from '@material-ui/icons'
export class NavigationBar extends React.Component {
    state = {
        anchorEl: null,
        mobileMoreAnchorEl: null,
    }

    handleProfileMenuOpen = event => {
        this.setState({ anchorEl: event.currentTarget })
    }
    
    handleMenuClose = route => {
        this.props.history.push(route)
        this.setState({ anchorEl: null })
    }
    render() {
        const { anchorEl} = this.state
        const isMenuOpen = Boolean(anchorEl)

        const renderMenu = (
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={this.handleMenuClose}
            >
                <MenuItem onClick={() => this.handleMenuClose('/')}>Movies</MenuItem>
                <MenuItem onClick={() => this.handleMenuClose('/login')}>Login</MenuItem>
            </Menu>
        )

    

        return (
            <div className={STYLES.root}>
                <AppBar position="static" >
                    <Toolbar className={STYLES.appBar}>
                        <div className={STYLES.name}>
                            <IconButton onClick={this.handleProfileMenuOpen} className={STYLES.menuButton} color="inherit" aria-label="Open drawer">
                                <MenuRounded />
                            </IconButton>
                            <Typography className={STYLES.title} variant="h6" color="inherit" noWrap>
                                Movies
                            </Typography>
                        </div>
                        
                        <div className={STYLES.search}>
                            <div className={STYLES.searchIcon}>
                                <Search />
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: STYLES.inputRoot,
                                    input: STYLES.inputInput,
                                }}
                            />
                        </div>
                        <div className={STYLES.sectionMobile}>
                            <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                                <More />
                            </IconButton>
                        </div>
                    </Toolbar>
                </AppBar>
                {renderMenu}
            </div>
        )
    }
}
const navItems = [
    {
        href: '/',
        text: 'Movies',
    },
    {
        href: '/login',
        text: 'Login'
    },
    {
        href: '/logout',
        text: 'logout'
    }
]

// export const NavigationBar = ({history}) => (
//     <PrimaryNav itemElement={Link}>
//         <NavItem onClick={() => history.push('/')}> Home </NavItem>
//         <NavItem onClick={() => history.push('/login')}> Login </NavItem>
//         <NavItem onClick={() => history.push('/logout')}> Logout </NavItem>
//     </PrimaryNav>
// )

export default withRouter(NavigationBar)
