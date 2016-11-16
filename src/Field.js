import { PureComponent, PropTypes } from 'react'
import invariant from 'invariant'
import objectPath from 'object-path'

import formStoreShape from './formStoreShape'
import * as actions from './actions'

function isValidPath(path) {
  invariant(typeof path === 'string' || Array.isArray(path),
    'Path must be string or an array of strings, ' +
    'you can use the format \'a.b.c\' for nested values')

  invariant(!/^errors/.test(path), 'Path cannot start with \'errors\'')

  return true
}

export default class Field extends PureComponent {
  componentWillMount() {
    const { path, validate, value } = this.props

    if (isValidPath(path)) {
      this.setValue = this.makeValueHandler(path)
      this.subscribeToPath(path)
      this.addValidators(path, validate)

      if (value) this.setValue(value)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { path, validate, value } = this.props

    if (path !== nextProps.path && isValidPath(nextProps.path)) {
      this.setValue = this.makeValueHandler(nextProps.path)

      if (this.unsubscribe) this.unsubscribe()
      this.subscribeToPath(path)

      if (this.removeValidators) this.removeValidators()
      this.addValidators(path, validate)
    }

    if (value !== nextProps.value) {
      this.setValue(nextProps.value)
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe()
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

    this.updateStateAtPath(form.getFormState(), path)

    this.setState({
      value: objectPath.get(state, path),
      error: objectPath.get(state, ['errors', path])
    })

    this.unsubscribe = form.subscribe(() => {
      this.updateStateAtPath(form.getFormState(), path)
    })
  }

  updateStateAtPath(state, path) {
    this.setState({
      value: objectPath.get(state, path),
      error: objectPath.get(state, ['errors', path])
    })
  }

  addValidators(path, validators = []) {
    const { form } = this.context
    const removeFns = [].concat(validators)
      .map(v => form.addValidator(path, v))

    this.removeValidators = () => removeFns.forEach(fn => fn())
  }

  render() {
    const { children } = this.props
    const { value, error } = this.state

    return children({ value, error, setValue: this.setValue })
  }
}

Field.propTypes = {
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]).isRequired,
  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.func)
  ]),
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  children: PropTypes.func.isRequired
}

Field.contextTypes = {
  form: formStoreShape.isRequired
}
