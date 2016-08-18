import React, { PureComponent } from 'react'

import BasicForm from './BasicForm'

export default class App extends PureComponent {
  handleUser = (user) => {
    this.setState({ user })
  }

  render() {
    const { user } = this.state || {}

    return (
      <main>
        <BasicForm onUser={this.handleUser} />
        { user &&
          <pre>
            { JSON.stringify(user, null, 2) }
          </pre>
        }
      </main>
    )
  }
}
