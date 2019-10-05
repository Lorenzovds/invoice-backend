import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Security, SecureRoute, ImplicitCallback } from '@okta/okta-react'
import 'semantic-ui-css/semantic.min.css'

import './index.css'
import config from './app.config'

import LoginPage from './components/auth/LoginPage'
import AuthenticatedContainer from './containers/authenticated-container'

function onAuthRequired ({ history }) {
  history.push('/login')
}

ReactDOM.render((
  <Router>
    <Security
      issuer={config.issuer}
      client_id={config.client_id}
      redirect_uri={config.redirect_uri}
      onAuthRequired={onAuthRequired}
    >
      <Switch>
        <Route exact path='/login' render={() => <LoginPage baseUrl={config.url} />} />
        <Route exact path='/implicit/callback' component={ImplicitCallback} />
        <SecureRoute path='/' component={AuthenticatedContainer} />
      </Switch>
    </Security>
  </Router>
), document.getElementById('root'))
