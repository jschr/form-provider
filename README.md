# form-provider

[![npm](https://img.shields.io/npm/v/form-provider.svg?style=flat-square)](https://www.npmjs.com/package/form-provider)
[![Build Status](https://travis-ci.org/jschr/form-provider.svg?branch=master)](https://travis-ci.org/jschr/form-provider)

A set of React helpers to help with building forms. State is managed with a Redux store that is local to your component. This promotes keeping your [ui state separate from your global application state](https://github.com/reactjs/redux/issues/1287#issuecomment-175351978) while still being able to use the redux ecosystem.

Demos:
  * [Basic Example](http://form-provider-basic-example.surge.sh/)

## Installation

```bash
npm install --save react react-dom redux react-redux # peer dependencies
npm install --save form-provider
```

## Basic Usage

```js
// BasicForm.js

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
        <Field path='field1' validate={[isRequired('Field1'), isNotNumber('Field1')]}>
          {({ value = '', setValue, error }) =>
            <div>
              <label>Field1*</label>
              <input type='text' value={value} onChange={target(setValue)} />
              { error && <div>{ error.message }</div> }
            </div>
          }
        </Field>
        <Field path='obj.field2'>
          {({ value = '', setValue }) =>
            <div>
              <label>Field2</label>
              <input type='number' value={value} onChange={target(setValue)} />
            </div>
          }
        </Field>
        <button type='submit'>Save</button>&nbsp;
        <button type='button' onClick={form.reset}>Reset</button>
      </form>
    </FormProvider>
  )
}

export default withForm(createForm)(BasicForm)

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

// or as a function of props
export default withForm(props => ({
  user: props.user
}))(BasicForm)

```

## Validation

This lib currently doesn't provide any validation functions out of the box, only an API to provide your own. Validators are functions that accept the current value and return a promise. Pass in a single validator or an array to the `<Field>` component. The form won't submit until all validators are resolved.

```js
// validators.js

export const isRequired = (name) => (value) => new Promise((resolve, reject) => {
  if (!value) return reject(new Error(`${name} is required`))
  resolve()
})

export const isNotNumber = (name) => (value) => new Promise((resolve, reject) => {
  if (!isNaN(value)) return reject(new Error(`${name} is must not be a number`))
  resolve()
})

```

## Binding to form state

Use the `connectForm` function to map form state to props. This function has the exact same API as react-redux's `connect` function. You can use this to conditionally display fields or other rendering logic based on the current form's state.

 ```js
function mapFormStateToProps(formState) {
  return {
    userFormState: formState.user,
    allErrors: formState.errors
  }
}

function BasicForm({ userFormState, allErrors, form, onSubmit }) {
  ...
})

export default compose(
  withForm(createForm)
  connectForm(mapFormStateToProps)
)(withForm)

```

## Alternatives

- [React Redux Form](https://github.com/davidkpiano/react-redux-form): Personal favourite, similar API.
- [Redux Form](https://github.com/erikras/redux-form): More features out of the box, mature and popular.
- [React Forms](https://github.com/prometheusresearch/react-forms): Validate with JSONSchema, no redux dependency


