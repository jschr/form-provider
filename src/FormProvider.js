import { PureComponent, PropTypes, Children } from 'react'

export default class FormProvider extends PureComponent {
  static propTypes = {
    store: PropTypes.object,
    submitOnValue: PropTypes.bool,
    onSubmit: PropTypes.func,
    children: PropTypes.node
  }

  static childContextTypes = {
    form: PropTypes.object
  }

  getChildContext() {
    const { store } = this.props

    return {
      form: store
    }
  }

  componentWillMount() {
    const { store, onSubmit, submitOnValue } = this.props

    this.removeSubmitListener = store.addSubmitListener(onSubmit, submitOnValue)
  }

  componentWillUnmount() {
    if (this.removeSubmitListener) this.removeSubmitListener()
  }

  render() {
    const { children } = this.props

    return Children.only(children)
  }
}
