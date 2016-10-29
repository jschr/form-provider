import React, { PureComponent } from 'react'
import { createStore } from 'redux'

import formReducer from './reducer'
import formEnhancer from './enhancer'

export default function withForm(initialState, reducer = formReducer, enhancer = formEnhancer()) {
  return (BaseComponent) => {
    class WrappedComponent extends PureComponent {
      componentWillMount() {
        const state = typeof initialState === 'function'
          ? initialState(this.props)
          : initialState

        this.form = createStore(reducer, state, enhancer)
      }

      componentWillUnmount() {
        this.form.unsubscribe()
        this.form = null
      }

      render() {
        return <BaseComponent {...this.props} form={this.form} />
      }
    }

    WrappedComponent.displayName = `withForm(${BaseComponent.displayName || 'Component'})`

    return WrappedComponent
  }
}
