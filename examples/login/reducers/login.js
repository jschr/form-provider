import * as loginConstants from '../constants/login'

export default function authReducer(state = {}, action = {}) {
  switch (action.type) {
    case loginConstants.PENDING:
      return { ...state, pending: true, error: null }

    case loginConstants.COMPLETE:
      return { ...state, pending: false }

    case loginConstants.ERROR:
      return { ...state, pending: false, error: action.payload }

    default:
      return state
  }
}
