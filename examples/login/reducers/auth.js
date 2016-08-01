import * as authConstants from '../constants/auth'

export default function authReducer(state = null, action = {}) {
  switch (action.type) {
    case authConstants.SET:
      return action.payload

    case authConstants.UNSET:
      return null

    default:
      return state
  }
}
