import * as authConstants from '../constants/auth'

export function setAuth(token) {
  return {
    type: authConstants.SET,
    payload: token
  }
}

export function unsetAuth() {
  return {
    type: authConstants.UNSET
  }
}
