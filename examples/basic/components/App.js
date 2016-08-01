import React, { PureComponent } from 'react'

import BasicForm from './BasicForm'

export default class App extends PureComponent {
  handleSubmit = (formState) => {
    this.setState({ user: formState.user })
  }

  render() {
    const { user } = this.state || {}

    return (
      <main>
        <BasicForm onSubmit={this.handleSubmit} />
        { user &&
          <pre>
            { JSON.stringify(user, null, 2) }
          </pre>
        }
      </main>
    )
  }
}
