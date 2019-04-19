import {connect} from 'react-refetch'
import {getToken} from './components/Auth/index'

export default connect.defaults({
    headers: {'Authorisation': `Bearer ${getToken()}`}
})