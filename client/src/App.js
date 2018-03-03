import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import { SecureRoute, ImplicitCallback } from '@okta/okta-react'

import './App.css'
import config from './app.config'
import LoginPage from './components/auth/LoginPage'
import AuthenticatedContainer from './containers/authenticated-container'

class App extends Component {
  render () {
    return (
      <Switch>
        <Route exact path='/login' render={() => <LoginPage baseUrl={config.url} />} />
        <Route exact path='/implicit/callback' component={ImplicitCallback} />
        <SecureRoute path='/' component={AuthenticatedContainer} />
      </Switch>
    )
  }
}

export default App
