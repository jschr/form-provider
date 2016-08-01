import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as authActions from '../actions/auth'
import * as userActions from '../actions/user'
import App from '../components/App'

function mapStateToProps(state) {
  return { 
    auth: state.auth,
    user: state.user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(authActions, dispatch),
    ...bindActionCreators(userActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App) 
