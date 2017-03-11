import * as React from 'react'
import { withForm, FormProvider, Field } from 'form-provider'

import { preventDefault, target } from './domHelpers'
import { isRequired, isNotNumber } from './validators'

export interface BasicFormProps {
  field1: string
  onSubmit: (formState: any) => void
}

function createForm(props) {
  return {
    field1: props.field1,
    obj: {
      field2: 4
    }
  }
}

function BasicForm({ form, onSubmit }) {
  return (
    <FormProvider form={form} onSubmit={onSubmit}>
      <form onSubmit={preventDefault(form.submit)}>
        <h3>Basic Form</h3>
        <Field path='field1' validate={[isRequired('field1'), isNotNumber('field1')]}>
          {({ value = '', setValue, error }) =>
            <div className={`form-group ${error ? 'has-danger' : ''}`}>
              <label className='form-control-label'>Field1*</label>
              <input
                type='text'
                value={value}
                onChange={target(setValue)}
                className={`form-control ${error ? 'form-control-danger' : ''}`}
              />
              { error && <div className='form-control-feedback'>{ error.message }</div> }
              <small className='form-text text-muted'>Hint: should not be a number</small>
            </div>
          }
        </Field>
        <Field path='obj.field2'>
          {({ value = '', setValue, error }) =>
            <div className='form-group'>
              <label className='form-control-label'>Field2</label>
              <input
                type='number'
                value={value}
                onChange={target(setValue)}
                className='form-control'
              />
            </div>
          }
        </Field>
        <button type='submit' className='btn btn-primary'>Save</button>&nbsp;
        <button type='button' onClick={form.reset} className='btn btn-secondary'>Reset</button>
      </form>
    </FormProvider>
  )
}

export default withForm<BasicFormProps>(createForm)(BasicForm)
