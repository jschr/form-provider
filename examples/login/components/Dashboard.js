import React from 'react'

export default function Dashboard({ user, onLogout }) {
  return (
    <div>
      <p>Welcome <strong>{ user.name }</strong>!</p>
      <p>Auth is persisted across page reloads using <a href="https://github.com/rt2zz/redux-persist">redux-persist</a>.</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  )
}
