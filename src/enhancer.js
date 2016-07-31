import objectPath from 'object-path'

import { VALUE } from './constants'
import * as actions from './actions'

export default function formEnhancer (formReducerName) {
  let validators = []
  let submitListeners = []

  const addValidator = (path, validator) => {
    validators.push({ path, validator })

    return () => removeValidator(path, validator)
  }

  const removeValidator = (path, validator) => {
    validators = validators.filter((v) => {
      return v.path !== path && v.validator !== validator
    })
  }

  const addSubmitListener = (listener, submitOnValue) => {
    submitListeners.push({ listener, submitOnValue })

    return () => removeSubmitListener(listener)
  }

  const removeSubmitListener = (listener) => {
    submitListeners = submitListeners.filter((x) => x.listener !== listener)
  }

  const getFormState = (store) => {
    let state = store.getState()

    if (formReducerName) state = state[formReducerName]

    return state
  }

  return (next) => (...args) => {
    const store = next(...args)
    const initialState = getFormState(store)
    let triggerOnValueListeners = false

    const submitForListeners = (listeners) => {
      if (listeners.length === 0) return Promise.resolve()

      return validate().then((isValid) => {
        if (!isValid) return

        const state = getFormState(store)

        listeners.forEach((listener) => listener(state))
      })
    }

    const dispatch = (action) => {
      if (action.type === VALUE) {
        triggerOnValueListeners = true
      }

      store.dispatch(action)
    }

    const runValidator = ({ path, validator }) => {
      const value = objectPath.get(getFormState(store), path)

      return validator(value)
        .then(() => {
          dispatch(actions.clearValidationError(path))

          return true
        })
        .catch((err) => {
          dispatch(actions.setValidationError(path, err))

          return false
        })
    }

    const validate = () => {
      return Promise.all(validators.map(runValidator))
        .then((results) => results.every((isValid) => isValid))
    }

    const submit = () => {
      const allSubmitListeners = submitListeners
        .map(({ listener }) => listener)

      return submitForListeners(allSubmitListeners)
    }

    const reset = () => {
      dispatch(actions.setState(initialState))
    }

    const clear = () => {
      dispatch(actions.setState({}))
    }

    // triggers submitOnValue listeners on state change, allows for async
    // store updates like batched subscribe
    const unsubscribe = store.subscribe(() => {
      if (triggerOnValueListeners) {
        triggerOnValueListeners = false

        const onValueSubmitListeners = submitListeners
          .filter(({ submitOnValue }) => submitOnValue)
          .map(({ listener }) => listener)

        submitForListeners(onValueSubmitListeners)
      }
    })

    return {
      ...store,
      dispatch,
      formReducerName,
      addValidator,
      removeValidator,
      validate,
      addSubmitListener,
      removeSubmitListener,
      submit,
      reset,
      clear,
      unsubscribe
    }
  }
}
