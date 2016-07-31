import { VALUE, VALIDATION_ERROR, CLEAR_VALIDATION_ERROR, SET_STATE } from './constants'

export const setValue = (path, value) => ({
  type: VALUE,
  payload: { path, value }
})

export const setValidationError = (path, error) => ({
  type: VALIDATION_ERROR,
  payload: { path, error }
})

export const clearValidationError = (path) => ({
  type: CLEAR_VALIDATION_ERROR,
  payload: { path }
})

export const setState = (state) => ({
  type: SET_STATE,
  payload: state
})

