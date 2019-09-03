import React from 'react'
import STYLES from './index.styl'
import {withRouter} from 'react-router-dom'
import {AppBar, Toolbar, IconButton, Typography, InputBase, MenuItem, Menu} from '@material-ui/core'
import {Search, More, MenuRounded} from '@material-ui/icons'
import qs from 'query-string'

export class NavigationBar extends React.Component {
    state = {
        anchorEl: null,
        mobileMoreAnchorEl: null,
        searchTerm: '',
    }

    handleProfileMenuOpen = event => {
        this.setState({anchorEl: event.currentTarget})
    }

    handleMenuClose = route => {
        this.props.history.push(route)
        this.setState({anchorEl: null})
    }

    handleChangeTerm = e => {
        const {value} = e.target
        this.setState({searchTerm: value})
    }

    handleEnter = e => e.key === 'Enter' && this.props.history.push({pathname: '/', search: this.state.searchTerm})

    handleRecommendations = () => {
        this.props.history.push({pathname: '/recommendations', search: this.state.searchTerm})
    }

    render() {
        const {anchorEl} = this.state
        const isMenuOpen = Boolean(anchorEl)

        const renderMenu = (
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                open={isMenuOpen}
                onClose={this.handleMenuClose}
            >
                <MenuItem onClick={() => this.handleMenuClose('/')}>Movies</MenuItem>
                <MenuItem onClick={() => this.handleMenuClose('/login')}>Login</MenuItem>
            </Menu>
        )

        return (
            <div className={STYLES.root}>
                <AppBar position="static">
                    <Toolbar className={STYLES.appBar}>
                        <div className={STYLES.name}>
                            <IconButton
                                onClick={this.handleProfileMenuOpen}
                                className={STYLES.menuButton}
                                color="inherit"
                                aria-label="Open drawer"
                            >
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
                                value={this.state.searchTerm}
                                onKeyDown={this.handleEnter}
                                placeholder="Search…"
                                classes={{
                                    root: STYLES.inputRoot,
                                    input: STYLES.inputInput,
                                }}
                                onChange={this.handleChangeTerm}
                            />
                        </div>
                        <div className={STYLES.sectionMobile}>
                            <IconButton aria-haspopup="true" onClick={this.handleRecommendations} color="inherit">
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

export default withRouter(NavigationBar)
