import React from 'react'
import { withForm, FormProvider, Field } from 'react-redux-local-form'

import { required, email } from '../validators'

const preventDefault = (next) => (e) => {
  e.preventDefault()
  next()
}

function BasicForm({ form, onUser }) {
  return (
    <FormProvider store={form} onSubmit={(formState) => onUser(formState.user)}>
      <form onSubmit={preventDefault(form.submit)}>
        <Field path="user.firstName" validate={required}>
          { ({ value = '', setValue, error }) =>
            <section>
              <label>First Name { error && <div className="error">{ error.message }</div> }</label>
              <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
            </section>
          }
        </Field>
        <Field path="user.lastName" validate={required}>
          { ({ value = '', setValue, error }) =>
            <section>
              <label>Last Name { error && <div className="error">{ error.message }</div> }</label>
              <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
            </section>
          }
        </Field>
        <Field path="user.email" validate={[ required, email ]}>
          { ({ value = '', setValue, error }) =>
            <section>
              <label>Email { error && <div className="error">{ error.message }</div> }</label>
              <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
            </section>
          }
        </Field>
        <Field path="user.mailingList">
          { ({ value, setValue }) =>
            <section>
              <label>
                <input type="checkbox" checked={value} onChange={(e) => setValue(e.target.checked)} />
                Join our mailing list
              </label>
            </section>
          }
        </Field>
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
