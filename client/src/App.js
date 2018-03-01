import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import './App.css'
import AuthenticatedContainer from './containers/authenticated-container'

class App extends Component {
  render () {
    return (
      <Switch>
        <Route path='/' component={AuthenticatedContainer} />
      </Switch>
    )
  }
}

export default App
