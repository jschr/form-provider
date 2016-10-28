import React from 'react'
import { connect } from 'react-redux'

export default function connectForm(...args) {
  return function wrapWithConnect(BaseComponent) {
    const ConnectedBaseComponent = connect(...args)(BaseComponent)

    return props =>
      <ConnectedBaseComponent {...props} store={props.form} /> // eslint-disable-line
  }
}
