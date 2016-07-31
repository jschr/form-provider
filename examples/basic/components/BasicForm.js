import React from 'react'
import { withForm, FormProvider, Field } from 'redux-local-form/lib/react'
import { isEmail } from 'validator'

const withError = (fn, error) => (value) => fn(value) || error

const required = withError(
  (value) => !!value, 
  new Error('Required')
)

const email = withError((
  value = '') => isEmail(value), 
  new Error('Invalid email')
)

const preventDefault = (next) => (e) => {
  e.preventDefault()
  next()
} 

function BasicForm({ form, onSubmit }) {
  return (
    <FormProvider store={form} onSubmit={({ user }) => onSubmit(user)}>
      <form onSubmit={preventDefault(form.submit)}>
        <Field path="user.firstName" validate={required}>
          { ({ value = '', setValue, error }) => 
            <div>
              <label>First Name</label>
              <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
              { error && error.message }
            </div>
          }
        </Field>
        <Field path="user.lastName" validate={required}>
          { ({ value = '', setValue, error }) => 
            <div>
              <label>Last Name</label>
              <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
              { error && error.message }
            </div>
          }
        </Field>
        <Field path="user.email" validate={[ required, email ]}>
          { ({ value = '', setValue, error }) => 
            <div>
              <label>Email</label>
              <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
              { error && error.message }
            </div>
          }
        </Field>
        <button type="submit">Save</button>
        <button type="button" onClick={form.reset}>Reset</button>
      </form>
    </FormProvider>
  )
}

export default withForm()(BasicForm)
