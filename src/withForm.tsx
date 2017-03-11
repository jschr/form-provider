import React, { PureComponent } from 'react'
import { createStore } from 'redux'

import formReducer, { FormState } from './reducer'
import formEnhancer, { FormStore } from './enhancer'

export interface FormProps {
  form: FormStore
}

export default function withForm<P>(
  initialState: FormState | ((props: P) => FormState),
  reducer = formReducer,
  enhancer = formEnhancer()
) {
  return (BaseComponent: React.ComponentClass<P & FormProps> | React.StatelessComponent<P & FormProps>) => {
    class WrappedComponent extends PureComponent<P, {}> {
      public static displayName = `withForm(${BaseComponent.displayName || 'Component'})`

      private form: FormStore

      public render() {
        return <BaseComponent {...this.props} form={this.form} />
      }

      private componentWillMount() {
        const state = typeof initialState === 'function'
          ? initialState(this.props)
          : initialState

        this.form = createStore(reducer, state, enhancer) as FormStore
      }

      private componentWillUnmount() {
        this.form.unsubscribe()
        this.form = null
      }
    }

    return WrappedComponent
  }
}
