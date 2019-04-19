import {withRouter} from 'react-router-dom'
import {checkToken} from './index'
export const withProtected = (props) => {
    const loggedIn = checkToken()
    
    return loggedIn ? (
        <props.WrappedComponent
            loggedIn={loggedIn}
        />
    ) : (
        {}
    )
}

export default withHistory(withProtected)