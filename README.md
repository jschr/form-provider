React Redux Local Form
=========================

React Redux Local Form is a set of minimal React components to help with building forms. State is managed with a Redux store that is local to your component. This promotes keeping your [ui state separate from your global state](https://github.com/reactjs/redux/issues/1287#issuecomment-175351978) while still being able to leverage the redux ecosystem. You can also mix and match redux reducers/actions between local and global state. If these ideas appeal to you read on... if not, check out some of these great alternatives:

- [React Redux Form](https://github.com/davidkpiano/react-redux-form): Personal favourite, similar API. 
- [Redux Form](https://github.com/erikras/redux-form): More features out of the box, mature and most popular.
- [React Forms](https://github.com/prometheusresearch/react-forms): No redux dependency

## Installation

React 15.3.0 and Redux 3.0.0 or later are peer dependencies.

```
npm install --save react-redux-local-form
```

## Basic Usage

```js
import React from 'react'
import { withForm, FormProvider, Field } from 'react-redux-local-form'

function BasicForm({ form, onSubmit }) {
  return (
    <FormProvider store={form} onSubmit={onSubmit}>
      <form onSubmit={preventDefault(form.submit)}>
        <Field path="user.firstName">
          { ({ value = '', setValue }) => 
            <div>
              <label>First Name</label>
              <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
          }
        </Field>
        <button type="submit">Save</button>
      </form>
    </FormProvider>
  )
}

const preventDefault = (next) => (e) => {
  e.preventDefault()
  next()
} 

export default withForm()(BasicForm)

```

Check out the [basic form example](examples/basic) for the entire source.

## Initial state

Setting initial form state is done by passing it into `withForm`

```js
...

export default withForm({
  user: {
    firstName: 'john'
  }
})(BasicForm)

// or a function of props
export default withForm((props) => {
  user: {
    firstName: props.user.firstName
  }
})(BasicForm)

```

## Validation

This lib currently doesn't provide any validation functions out of the box, only an API to provide your own. Validation functions are simply functions that accept the current value and return a promise. Pass in a single validation function or an array to the `<Field>` component. The form won't submit until all validation functions are resolved.

```js
import React from 'react'
import { withForm, FormProvider, Field } from 'react-redux-local-form'
import { isEmail } from 'validator'

const required = (value) => new Promise((resolve, reject) => {
  if (value) { resolve() }
  else { reject(new Error('Invalid Email')) }
})

const email = (value) => new Promise((resolve, reject) => {
  if (isEmail(value)) { resolve() }
  else { reject(new Error('Invalid Email')) }
})

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
        <Field path="user.firstName" validate={[ required, email ]}>
          ...
        </Field>
        <button type="submit">Save</button>
      </form>
    </FormProvider>
  )
}

export default withForm()(BasicForm)
``` 

Check out the [basic form example](examples/basic) for the entire source.

## Binding to form state

Use the `connectForm` function to map form state to props. This function has the exact same API as react-redux's `connect` function.

 ```js
import React from 'react'
import { withForm, connectForm, FormProvider, Field } from 'react-redux-local-form'

function mapFormStateToProps(formState) {
  return { 
    userFormState: formState.user,
    allErrors: formState.errors 
  }
}

function BasicForm({ userFormState, allErrors, form, onSubmit }) {
  ...
})

export default withForm()(
  connectForm(mapFormStateToProps)(withForm)
)

```

## Advanced Usage

