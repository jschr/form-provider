import { PureComponent, PropTypes } from 'react'
import invariant from 'invariant'
import objectPath from 'object-path'

import * as actions from './actions'

export default class Field extends PureComponent {
  static propTypes = {
    path: PropTypes.string,
    validate: PropTypes.any,
    children: PropTypes.any
  }

  static contextTypes = {
    form: PropTypes.object
  }

  isValidPath(path) {
    invariant(typeof path === 'string' || Array.isArray(path),
      `Path must be string or an array of strings, ` +
      `you can use the format 'a.b.c' for nested values`)

    invariant(!/^errors/.test(path), `Path cannot start with 'errors'`)

    return true
  }

  makeValueHandler(path) {
    return (value) => {
      const { form } = this.context
      form.dispatch(actions.setValue(path, value))
    }
  }

  subscribeToPath(path) {
    const { form } = this.context
    const state = form.getFormState()

    this.setState({
      value: objectPath.get(state, path),
      error: objectPath.get(state, [ 'errors', path ])
    })

    this.unsubscribe = form.subscribe(() => {
      const state = form.getFormState()

      this.setState({
        value: objectPath.get(state, path),
        error: objectPath.get(state, [ 'errors', path ])
      })
    })
  }

  addValidators(path, validators = []) {
    const { form } = this.context
    const removeFns = [].concat(validators)
      .map((v) => form.addValidator(path, v))

    this.removeValidators = () => removeFns.forEach((fn) => fn())
  }

  componentWillMount() {
    const { path, validate } = this.props

    if (this.isValidPath(path)) {
      this.setValue = this.makeValueHandler(path)
      this.subscribeToPath(path)
      this.addValidators(path, validate)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { path, validate } = this.props

    if (path !== nextProps.path && this.isValidPath(nextProps.path)) {
      this.setValue = this.makeValueHandler(nextProps.path)

      if (this.unsubscribe) this.unsubscribe()
      this.subscribeToPath(path)

      if (this.removeValidators) this.removeValidators()
      this.addValidators(path, validate)
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe()
  }

  render() {
    const { children } = this.props
    const { value, error } = this.state

    return children({ value, error, setValue: this.setValue })
  }
}
