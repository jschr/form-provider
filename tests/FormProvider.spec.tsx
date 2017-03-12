import * as React from 'react'
import * as expect from 'expect'
import { shallow } from 'enzyme'
import * as TestUtils from 'react-addons-test-utils'
import { createStore } from 'redux'

import { FormProvider, FormStore, formReducer, createFormEnhancer, formStoreShape } from '../src'

const form = createStore(formReducer, {}, createFormEnhancer()) as FormStore

describe('FormProvider', () => {
  it('should render children components', () => {
    const wrapper = shallow(
      <FormProvider form={form}>
        <div className='unique'/>
      </FormProvider>
    )

    expect(wrapper.contains(<div className='unique'/>)).toBe(true)
  })

  it('should require a form', () => {
    const originalConsoleError = console.error
    console.error = () => { /* noop */ }

    expect(() => {
      shallow(
        <FormProvider form={undefined}>
          <div className='unique'/>
        </FormProvider>
      )
    }).toThrow()

    console.error = originalConsoleError
  })

  it('should error if rendered without a child component', () => {
    const originalConsoleError = console.error
    console.error = () => { /* noop */ }

    expect(() => {
      shallow(<FormProvider form={form} />)
    }).toThrow()

    console.error = originalConsoleError
  })

  it('should add the form to the child context', () => {
    class Child extends React.Component<any, { store: any, client: any}> {
      public static contextTypes: React.ValidationMap<any> = {
        form: formStoreShape.isRequired,
      }

      public context: {
        form: FormStore
      }

      public render() {
        return <div />
      }
    }

    const tree = TestUtils.renderIntoDocument(
      <FormProvider form={form}>
        <Child />
      </FormProvider>
    ) as React.Component<any, any>

    const child = TestUtils.findRenderedComponentWithType(tree, Child)
    expect(child.context.form).toEqual(form)
  })

  it('should handle submit')
})
