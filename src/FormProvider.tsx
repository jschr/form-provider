import { PureComponent, Children } from 'react'
import * as PropTypes from 'prop-types'
import * as invariant from 'invariant'

import { FormStore, SubmitListenerFn, RemoveSubmitListenerFn } from './formEnhancer'
import { FormState } from './formReducer'
import formStoreShape from './formStoreShape'

export interface FormProviderProps {
  form: FormStore
  onSubmit?: SubmitListenerFn
  submitOnValue?: boolean
}

export default class FormProvider extends PureComponent<FormProviderProps, {}> {
  private static propTypes = {
    form: formStoreShape.isRequired,
    submitOnValue: PropTypes.bool,
    onSubmit: PropTypes.func,
    children: PropTypes.node
  }

  private static childContextTypes = {
    form: formStoreShape.isRequired
  }

  private removeSubmitListener: RemoveSubmitListenerFn

  constructor(props, context) {
    super(props, context)

    invariant(props.form, 'FormProvider is missing the "form" prop.')
  }

  public render() {
    const { children } = this.props

    return Children.only(children)
  }

  public getChildContext() {
    const { form } = this.props

    return { form }
  }

  public componentWillMount() {
    const { form, onSubmit, submitOnValue } = this.props

    if (onSubmit) {
      this.removeSubmitListener = form.addSubmitListener(onSubmit, submitOnValue)
    }
  }

  public componentWillUnmount() {
    if (this.removeSubmitListener) this.removeSubmitListener()
  }
}
