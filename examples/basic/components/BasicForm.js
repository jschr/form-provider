import React from 'react'
import { withForm, FormProvider, Field } from 'react-redux-local-form'

import { required, email } from '../validators'

function BasicForm({ form, onSubmit }) {
  return (
    <FormProvider store={form} onSubmit={onSubmit}>
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
        <Field path="user.mailingList">
          { ({ value, setValue, error }) => 
            <div>
              <label>
                <input type="checkbox" checked={value} onChange={(e) => setValue(e.target.checked)} />
                Join our mailing list
              </label>
              { error && error.message }
            </div>
          }
        </Field>
        <br />
        <button type="submit">Save</button>
        <button type="button" onClick={form.reset}>Reset</button>
      </form>
    </FormProvider>
  )
}

export default withForm({
  user: {
    mailingList: false
  }
})(BasicForm)
