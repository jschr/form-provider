import { VALUE, VALIDATION_ERROR, CLEAR_VALIDATION_ERROR, SET_STATE } from './constants'

export function setValue(path, value) {
  return {
    type: VALUE,
    payload: { path, value }
  }
}

export function setValidationError(path, error) {
  return {
    type: VALIDATION_ERROR,
    payload: { path, error }
  }
}

export function clearValidationError(path) {
  return {
    type: CLEAR_VALIDATION_ERROR,
    payload: { path }
  }
}

export function setState(state) {
  return {
    type: SET_STATE,
    payload: state
  }
}
