import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import '../App.css'
import InvoicesContainer from './invoices-container'

class AuthenticatedContainer extends Component {
  render () {
    return (
      <div>
        <h2>MAIN PAGE</h2>
        <Switch>
          <Route path='/invoices' component={InvoicesContainer} />
        </Switch>
      </div>
    )
  }
}

export default AuthenticatedContainer
