import * as React from 'react'
import * as ReactDOM from 'react-dom'

import BasicForm from './BasicForm'

function render(formState?: any) {
  ReactDOM.render(
    <div className='container'>
      <BasicForm field1='default' onSubmit={render} />
      <pre>{ JSON.stringify(formState, null, '  ') }</pre>
    </div>,
    document.getElementById('root')
  )
}

render()
