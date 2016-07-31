import React from 'react'
import { connect } from 'react-redux'

export default function connectForm (...connectArgs) {
  return (BaseComponent) => {
    const ConnectedBaseComponent = connect(...connectArgs)(BaseComponent)

    return (props) =>
      <ConnectedBaseComponent { ...props } store={ props.form } />
  }
}
