import * as objectPath from 'object-path'
import * as immutable from 'object-path-immutable'
import { Action } from 'redux'

import {
  VALUE,
  VALIDATION_ERROR,
  CLEAR_VALIDATION_ERROR,
  SET_STATE,
  INIT_STATE
} from './constants'

export interface FormState {
  errors?: Error[]
  [key: string]: any
}

export default function formReducer(state = {}, action: any): FormState {
  switch (action.type) {
    case VALUE:
      return immutable.set(state, action.payload.path, action.payload.value)

    case VALIDATION_ERROR:
      // if error already exists at path, dont overwrite it
      return objectPath.get(state, ['errors', action.payload.path])
        ? state
        : immutable.set(state, ['errors', action.payload.path], action.payload.error)

    case CLEAR_VALIDATION_ERROR:
      const newState = immutable.del(state, ['errors', action.payload.path])

      // delete errors key from state if empty array
      if (newState.errors && Object.keys(newState.errors).length === 0) {
        delete newState.errors
      }

      return newState

    case SET_STATE:
      return { ...state, ...action.payload }

    case INIT_STATE:
      return action.payload

    default:
      return state
  }
}
