import {connect} from 'react-refetch'
import {getToken} from './components/Auth/index'

const settings = getToken()
    ? {
          headers: {authorization: `${getToken()}`},
      }
    : {}
export default connect.defaults(settings)
