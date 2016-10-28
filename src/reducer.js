import objectPath from 'object-path'
import immutable from 'object-path-immutable'

import { VALUE, VALIDATION_ERROR, CLEAR_VALIDATION_ERROR, SET_STATE } from './constants'

const handlers = {
  [VALUE]: (state, { path, value }) => immutable.set(state, path, value),

  [VALIDATION_ERROR]: (state, { path, error }) => { // eslint-disable-line arrow-body-style
    // if error already exists at path, dont overwrite it
    return objectPath.get(state, ['errors', path])
      ? state
      : immutable.set(state, ['errors', path], error)
  },

  [CLEAR_VALIDATION_ERROR]: (state, { path }) => {
    const newState = immutable.del(state, ['errors', path])

    if (newState.errors && Object.keys(newState.errors).length === 0) {
      delete newState.errors
    }

    return newState
  },

  [SET_STATE]: (oldState, newState) => newState
}

export default function formReducer(state = {}, action = {}) {
  return handlers[action.type]
    ? handlers[action.type](state, action.payload)
    : state
}
