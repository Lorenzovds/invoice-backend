import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import '../App.css'
import InvoiceContainer from './invoice-container'

class InvoicesContainer extends Component {
  render () {
    return (
      <div>
        <h2>invoices</h2>
        <Switch>
          <Route exact path='/invoices' render={this.renderAllInvoices} />
          <Route exact path='/invoices/:id' component={InvoiceContainer} />
        </Switch>
      </div>
    )
  }

  renderAllInvoices () {
    return (
      <h2>All Invoices</h2>
    )
  }
}

export default InvoicesContainer
