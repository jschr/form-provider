import React, { Component } from 'react'
import { createStore } from 'redux'
import { isFunction } from 'lodash'

import formReducer from '../reducer'
import formEnhancer from '../enhancer'

export default function withForm (initialState, reducer = formReducer, enhancer = formEnhancer()) {
  return (BaseComponent) => {
    class WrappedComponent extends Component {
      static displayName = `withForm(${ BaseComponent.displayName || 'Component' })`

      componentWillMount () {
        const state = isFunction(initialState) ? initialState(this.props) : initialState

        this.form = createStore(reducer, state, enhancer)
      }

      componentWillUnmount () {
        this.form.unsubscribe()
        this.form = null
      }

      render () {
        return <BaseComponent { ...this.props } form={ this.form } />
      }
    }

    return WrappedComponent
  }
}
