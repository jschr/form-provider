import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { persistStore, autoRehydrate } from 'redux-persist'

import authReducer from './reducers/auth'
import userReducer from './reducers/user'
import App from './containers/App'

const store = createStore(
  combineReducers({
    auth: authReducer,
    user: userReducer
  }),
  {},
  autoRehydrate()
)

persistStore(store, {}, () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>, 
    document.getElementById('root')
  )
})
