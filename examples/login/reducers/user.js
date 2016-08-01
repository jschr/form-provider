import * as userConstants from '../constants/user'

export default function authReducer(state = {}, action = {}) {
  switch (action.type) {
    case userConstants.SET:
      return { ...state, ...action.payload }

    default:
      return state
  }
}
