import { PureComponent, PropTypes, Children } from 'react'

import formStoreShape from './formStoreShape'

export default class FormProvider extends PureComponent {
  getChildContext() {
    const { form } = this.props

    return { form }
  }

  componentWillMount() {
    const { form, onSubmit, submitOnValue } = this.props

    this.removeSubmitListener = form.addSubmitListener(onSubmit, submitOnValue)
  }

  componentWillUnmount() {
    if (this.removeSubmitListener) this.removeSubmitListener()
  }

  render() {
    const { children } = this.props

    return Children.only(children)
  }
}

FormProvider.propTypes = {
  form: formStoreShape.isRequired,
  submitOnValue: PropTypes.bool,
  onSubmit: PropTypes.func,
  children: PropTypes.node
}

FormProvider.childContextTypes = {
  form: formStoreShape.isRequired
}
