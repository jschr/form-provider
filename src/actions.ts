import * as objectPath from 'object-path'

import {
  VALUE,
  VALIDATION_ERROR,
  CLEAR_VALIDATION_ERROR,
  SET_STATE,
  INIT_STATE
} from './constants'

export function setValue(path: objectPath.Path, value: any) {
  return {
    type: VALUE,
    payload: { path, value }
  }
}

export function setValidationError(path: objectPath.Path, error: Error) {
  return {
    type: VALIDATION_ERROR,
    payload: { path, error }
  }
}

export function clearValidationError(path: objectPath.Path) {
  return {
    type: CLEAR_VALIDATION_ERROR,
    payload: { path }
  }
}

export function setState(state: Object) {
  return {
    type: SET_STATE,
    payload: state
  }
}

export function initializeState(state: Object) {
  return {
    type: INIT_STATE,
    payload: state
  }
}
