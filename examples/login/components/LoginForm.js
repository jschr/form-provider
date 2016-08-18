import React, { PureComponent } from 'react'
import { combineReducers, bindActionCreators, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import {
  withForm,
  connectForm,
  FormProvider,
  Field,
  reducer as formReducer,
  enhancer as formEnhancer
} from 'react-redux-local-form'

import loginReducer from '../reducers/login'
import * as loginActions from '../actions/login'
import { preventDefault, targetValue } from '../helpers'
import { required, email } from '../validators'

class LoginForm extends PureComponent {
  handleSubmit = (formState) => {
    const { attemptLogin, onAuthToken, onUser } = this.props
    const { email, password } = formState

    attemptLogin(email, password)
      .then(({ token, profile }) => {
        onAuthToken(token)
        onUser(profile)
      })
  }

  render() {
    const { form, loginPending, loginError } = this.props

    return (
      <FormProvider store={form} onSubmit={this.handleSubmit}>
        <form onSubmit={preventDefault(form.submit)}>
          <Field path="email" validate={[ required, email ]}>
            { ({ value = '', setValue, error }) =>
              <section>
                <label>Email { error && <div className="error">{ error.message }</div> }</label>
                <input type="text" value={value} onChange={targetValue(setValue)} />
              </section>
            }
          </Field>
          <Field path="password" validate={required}>
            { ({ value = '', setValue, error }) =>
              <section>
                <label>Password { error && <div className="error">{ error.message }</div> }</label>
                <input type="password" value={value} onChange={targetValue(setValue)} />
                <small>Type 'error' to force a login error</small>
              </section>
            }
          </Field>
          { loginError &&
            <div className="error">{ loginError.message }</div>
          }
          <button type="submit" disabled={loginPending}>
            { loginPending ? 'Logging in...' : 'Login' }
          </button>
        </form>
      </FormProvider>
    )
  }
}

const initialFormState = {
  form: {},
  login: {
    error: null,
    pending: false
  }
}

const reducer = combineReducers({
  form: formReducer,
  login: loginReducer
})

const enhancer = compose(
  applyMiddleware(thunk),
  formEnhancer('form')
)

function mapFormStateToProps(state) {
  return {
    loginPending: state.login.pending,
    loginError: state.login.error
  }
}

function mapFormDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(loginActions, dispatch)
  }
}

export default withForm(initialFormState, reducer, enhancer)(
  connectForm(mapFormStateToProps, mapFormDispatchToProps)(LoginForm)
)
