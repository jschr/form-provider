import * as objectPath from 'object-path'
import { Action, Store, Unsubscribe } from 'redux'

import { VALUE } from './constants'
import * as actions from './actions'
import { FormState } from './formReducer'

export type ValidatorFn = (value: any, formState: FormState, path: objectPath.Path) => Promise<any>

export interface Validator {
  path: objectPath.Path,
  fn: ValidatorFn
}

export type SubmitListenerFn = (formState: FormState) => Promise<any>

export interface SubmitListener {
  listener: SubmitListenerFn
  submitOnValue: boolean
}

export type RemoveValidatorFn = () => void

export type RemoveSubmitListenerFn = () => void

export interface FormStore extends Store<any> {
  getFormState: () => FormState
  setFormState: (state: FormState) => void
  dispatch: (action: Action) => void
  addValidator: (path: objectPath.Path, fn: ValidatorFn) => RemoveValidatorFn
  removeValidator: (path: objectPath.Path, fn: ValidatorFn) => void
  addSubmitListener: (listener: SubmitListenerFn, submitOnValue: boolean) => RemoveSubmitListenerFn
  removeSubmitListener: (listener: SubmitListenerFn) => void
  validate: () => Promise<boolean>
  submit: () => Promise<void>
  setValue: (path: objectPath.Path, value: any) => void
  setValidationError: (path: objectPath.Path, value: any) => void
  clearValidationError: (path: objectPath.Path) => void
  reset: () => void
  clear: () => void
  unsubscribe: () => void
}

export default function formEnhancer(formReducerName?: string) {
  let validators: Validator[] = []
  let submitListeners: SubmitListener[] = []

  function removeValidator(path: objectPath.Path, fn: ValidatorFn): void {
    validators = validators.filter((v) => {
      return v.path !== path && v.fn !== fn
    })
  }

  function removeSubmitListener(listener: SubmitListenerFn): void {
    submitListeners = submitListeners.filter((sl) => {
      return sl.listener !== listener
    })
  }

  function addValidator(path: objectPath.Path, fn: ValidatorFn): RemoveValidatorFn {
    validators.push({ path, fn })

    return () => removeValidator(path, fn)
  }

  function addSubmitListener(listener: SubmitListenerFn, submitOnValue: boolean): RemoveSubmitListenerFn {
    submitListeners.push({ listener, submitOnValue })

    return () => removeSubmitListener(listener)
  }

  return (next: (...args: any[]) => any) => (...args: any[]): FormStore => {
    const store: Store<any> = next(...args)
    // flag to submit on state change, allows for async store updates like batched subscribe
    let triggerOnValueListeners = false

    function getFormState(): FormState {
      let state = store.getState() || {}

      if (formReducerName) state = state[formReducerName]

      return state
    }

    const initialState = getFormState()

    function dispatch(action: Action): void {
      if (action.type === VALUE) {
        triggerOnValueListeners = true
      }

      store.dispatch(action)
    }

    function runValidator(validator: Validator): Promise<boolean> {
      const formState = getFormState()
      const value = objectPath.get(formState, validator.path)
      return validator.fn(value, formState, validator.path)
        .then(() => {
          dispatch(actions.clearValidationError(validator.path))
          return true
        })
        .catch((err) => {
          dispatch(actions.setValidationError(validator.path, err))
          return false
        })
    }

    function validate(): Promise<boolean> {
      return Promise.all(validators.map(runValidator))
        .then((results) => {
          return results.every((isValid) => isValid)
        })
    }

    function submitWithListeners(listeners: SubmitListenerFn[]): Promise<void> {
      if (listeners.length === 0) return Promise.resolve()

      return validate().then((isValid) => {
        if (!isValid) return

        const state = getFormState()

        listeners.forEach((listener) => listener(state))
      })
    }

    const unsubscribe = store.subscribe(() => {
      if (triggerOnValueListeners) {
        triggerOnValueListeners = false

        const onValueSubmitListeners = submitListeners
          .filter(({ submitOnValue }) => submitOnValue)
          .map(({ listener }) => listener)

        submitWithListeners(onValueSubmitListeners)
      }
    })

    function submit() {
      const allSubmitListeners = submitListeners
        .map(({ listener }) => listener)

      return submitWithListeners(allSubmitListeners)
    }

    function setValue(path: objectPath.Path, value: any): void {
      dispatch(actions.setValue(path, value))
    }

    function setValidationError(path: objectPath.Path, value: any): void {
      dispatch(actions.setValidationError(path, value))
    }

    function clearValidationError(path: objectPath.Path): void {
      dispatch(actions.clearValidationError(path))
    }

    function reset(): void {
      dispatch(actions.initializeState(initialState))
    }

    function clear(): void {
      dispatch(actions.initializeState({}))
    }

    function setFormState(state: FormState): void {
      dispatch(actions.setState(state))
    }

    return {
      ...store,
      getFormState,
      setFormState,
      dispatch,
      addValidator,
      removeValidator,
      addSubmitListener,
      removeSubmitListener,
      validate,
      submit,
      setValue,
      setValidationError,
      clearValidationError,
      reset,
      clear,
      unsubscribe
    }
  }
}
