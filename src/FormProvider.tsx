import { PureComponent, PropTypes, Children } from 'react'
import { FormStore, SubmitListenerFn, RemoveSubmitListenerFn } from './enhancer'
import { FormState } from './reducer'

import formStoreShape from './formStoreShape'

export interface FormProviderProps {
  form: FormStore
  onSubmit: SubmitListenerFn
  submitOnValue: boolean
}

export default class FormProvider extends PureComponent<FormProviderProps, void> {
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

  public render() {
    const { children } = this.props

    return Children.only(children)
  }

  private getChildContext() {
    const { form } = this.props

    return { form }
  }

  private componentWillMount() {
    const { form, onSubmit, submitOnValue } = this.props

    this.removeSubmitListener = form.addSubmitListener(onSubmit, submitOnValue)
  }

  private componentWillUnmount() {
    if (this.removeSubmitListener) this.removeSubmitListener()
  }
}
