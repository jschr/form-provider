import objectPath from 'object-path'

import { VALUE } from './constants'
import * as actions from './actions'

export default function formEnhancer(formReducerName) {
  let validators = []
  let submitListeners = []
  
  function addValidator(path, validator) {
    validators.push({ path, validator })
    return () => removeValidator(path, validator)
  }

  function removeValidator(path, validator) {
    validators = validators.filter((v) => {
      return v.path !== path && v.validator !== validator
    })
  }

  function addSubmitListener(listener, submitOnValue) {
    submitListeners.push({ listener, submitOnValue })
    return () => removeSubmitListener(listener)
  }

  function removeSubmitListener(listener) {
    submitListeners = submitListeners.filter((sl) => {
      return sl.listener !== listener
    })
  }

  return (next) => (...args) => {
    const store = next(...args)
    const initialState = getFormState()
    let triggerOnValueListeners = false

    // triggers submitOnValue listeners on state change, allows for async
    // store updates like batched subscribe
    const unsubscribe = store.subscribe(() => {
      if (triggerOnValueListeners) {
        triggerOnValueListeners = false

        const onValueSubmitListeners = submitListeners
          .filter(({ submitOnValue }) => submitOnValue)
          .map(({ listener }) => listener)

        submitWithListeners(onValueSubmitListeners)
      }
    })

    function getFormState() {
      let state = store.getState() || {}

      if (formReducerName) state = state[formReducerName]

      return state
    }


    function submitWithListeners(listeners) {
      if (listeners.length === 0) return Promise.resolve()

      return validate().then((isValid) => {
        if (!isValid) return
        const state = getFormState()
        listeners.forEach((listener) => listener(state))
      })
    }

    function dispatch(action) {
      if (action.type === VALUE) {
        triggerOnValueListeners = true
      }

      store.dispatch(action)
    }

    function runValidator({ path, validator }) {
      const value = objectPath.get(getFormState(), path)
    
      return validator(value, path, getFormState())
        .then(() => {
          dispatch(actions.clearValidationError(path))
          return true
        })
        .catch((err) => {
          dispatch(actions.setValidationError(path, err))
          return false
        })
    }

    function validate() {
      return Promise.all(validators.map(runValidator))
        .then((results) => results.every((isValid) => isValid))
    }

    function submit() {
      const allSubmitListeners = submitListeners
        .map(({ listener }) => listener)

      return submitWithListeners(allSubmitListeners)
    }

    function reset() {
      dispatch(actions.setState(initialState))
    }

    function clear() {
      dispatch(actions.setState({}))
    }

    return {
      ...store,
      getFormState,
      dispatch,
      addValidator,
      removeValidator,
      addSubmitListener,
      removeSubmitListener,
      validate,
      submit,
      reset,
      clear,
      unsubscribe
    }
  }
}
