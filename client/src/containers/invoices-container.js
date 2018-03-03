import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import '../App.css'
import InvoiceContainer from './invoice-container'
import NewInvoiceContainer from './new-invoice-container'

class InvoicesContainer extends Component {
  constructor (props) {
    super(props)
    Object.assign(this, props)
    this.setActiveMenu('all')
  }
  render () {
    return (
      <div>
        <Switch>
          <Route exact path='/invoices' render={this.renderAllInvoices} />
          <Route exact path='/invoices/new' render={props => <NewInvoiceContainer setActiveMenu={this.setActiveMenu} />} />
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
