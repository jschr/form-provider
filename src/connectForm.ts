import { Dispatch } from 'redux'
import { connect, Options, ComponentDecorator, ComponentMergeDecorator } from 'react-redux'

export interface ConnectOptions extends Options {
  getDisplayName: (name: string) => string
  methodName: string
  storeKey: string
}

export default function connectForm(
  mapStateToProps: (state: any) => any,
  mapDispatchToProps?: (dispatch: Dispatch<any>) => any,
  mergeProps?: (stateProps: any, dispatchProps: any, ownProps: any) => any,
): ComponentDecorator<any> {
  const options: ConnectOptions = {
    getDisplayName: (name) => `ConnectForm(${name})`,
    methodName: 'connectForm',
    storeKey: 'form'
  }

  return connect(mapStateToProps, mapDispatchToProps, mergeProps, options)
}
