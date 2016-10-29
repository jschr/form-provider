import React from 'react'
import { connect } from 'react-redux'

import formStoreShape from './formStoreShape'

export default function connectForm(...args) {
  return function wrapWithConnect(BaseComponent) {
    const ConnectedBaseComponent = connect(...args)(BaseComponent)

    function ConnectedComponent(props, context) {
      return (
        <ConnectedBaseComponent {...props} store={context.form} />
      )
    }

    ConnectedComponent.contextTypes = {
      theme: formStoreShape.isRequired
    }

    return ConnectedComponent
  }
}
