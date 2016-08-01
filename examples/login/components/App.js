import React from 'react'

import Dashboard from './Dashboard'
import LoginForm from './LoginForm'

export default function App({ auth, user, setAuth, unsetAuth, setUser }) {
  return (
    <main>
      { auth
        ? <Dashboard user={user} onLogout={unsetAuth} />
        : <LoginForm onAuthToken={setAuth} onUser={setUser} />
      }
    </main>
  )
}
