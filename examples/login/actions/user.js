import * as userConstants from '../constants/user'

export function setUser(user) {
  return {
    type: userConstants.SET,
    payload: user
  }
}
