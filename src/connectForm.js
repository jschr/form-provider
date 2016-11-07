import React from 'react'
import { connect } from 'react-redux'

import formStoreShape from './formStoreShape'

export default function connectForm(...args) {
  return function wrapWithConnect(BaseComponent) {
    const ConnectedBaseComponent = connect(...args)(BaseComponent)

    function ConnectedComponent(props) {
      return (
        <ConnectedBaseComponent {...props} store={props.form} />
      )
    }

    ConnectedComponent.propTypes = {
      form: formStoreShape.isRequired
    }

    return ConnectedComponent
  }
}
