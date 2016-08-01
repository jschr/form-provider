import * as loginConstants from '../constants/login' 

export function attemptLogin(username, password) {
  return (dispatch) => {
    dispatch({ type: loginConstants.PENDING })

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        dispatch({ type: loginConstants.COMPLETE })

        if (!username || !password || password === 'error') {
          const error = new Error('Invalid username or password')
          dispatch({ type: loginConstants.ERROR, payload: error })
          reject(error)
        } else {
          resolve({ token: 'some_session_id', profile: { name: username } })
        }
      }, 1000)
    })
  }
}
