import * as React from 'react'
import * as PropTypes from 'prop-types'
import * as objectPath from 'object-path'
import * as invariant from 'invariant'
import { Unsubscribe } from 'redux'

import formStoreShape from './formStoreShape'
import * as actions from './actions'
import { FormStore, ValidatorFn } from './formEnhancer'
import { FormState } from './formReducer'

function isValidPath(path: objectPath.Path) {
  invariant(typeof path === 'string' || Array.isArray(path),
    'Path must be string or an array of strings, ' +
    'you can use the format \'a.b.c\' for nested values')

  invariant(typeof path === 'string' && !/^errors/.test(path), 'Path cannot start with \'errors\'')

  return true
}

export interface RenderOpts {
  value?: any
  setValue?: ValueHandler
  error?: Error
}

export type RenderHandler = (opts: RenderOpts) => React.ReactElement<any>

export interface FieldProps {
  path: objectPath.Path
  validate?: ValidatorFn | ValidatorFn[]
  value?: any
  children?: RenderHandler
}

export interface FieldState {
  value: any
  error: Error
}

export type ValueHandler = (value: any) => void

export type RemoveValidatorsHandler = () => void

export default class Field extends React.PureComponent<FieldProps, FieldState> {
  private static propTypes = {
    path: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array
    ]).isRequired,
    validate: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.arrayOf(PropTypes.func)
    ]),
    value: PropTypes.any,
    children: PropTypes.func.isRequired
  }

  private static contextTypes = {
    form: formStoreShape.isRequired
  }

  public context: {
    form: FormStore
  }

  private setValue: ValueHandler
  private unsubscribe: Unsubscribe
  private removeValidators: RemoveValidatorsHandler

  public render() {
    const { children } = this.props
    const { value, error } = this.state

    return children({ value, error, setValue: this.setValue })
  }

  public componentWillMount() {
    const { path, validate, value } = this.props

    if (isValidPath(path)) {
      this.setValue = this.makeValueHandler(path)
      this.subscribeToPath(path)
      this.addValidators(path, validate)

      if (value) this.setValue(value)
    }
  }

  public componentWillReceiveProps(nextProps: FieldProps) {
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

  public componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe()
  }

  private makeValueHandler(path: objectPath.Path) {
    return (value: any) => {
      const { form } = this.context
      form.dispatch(actions.setValue(path, value))
    }
  }

  private subscribeToPath(path: objectPath.Path) {
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

  private updateStateAtPath(state: FormState, path: objectPath.Path) {
    this.setState({
      value: objectPath.get(state, path),
      error: objectPath.get(state, ['errors', path])
    })
  }

  private addValidators(path: objectPath.Path, validators: ValidatorFn | ValidatorFn[] = []) {
    const { form } = this.context
    const removeFns = ([] as ValidatorFn[]).concat(validators)
      .map((validator: ValidatorFn) => form.addValidator(path, validator))

    this.removeValidators = () => removeFns.forEach((fn) => fn())
  }
}
