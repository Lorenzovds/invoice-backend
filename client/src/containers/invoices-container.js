import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import '../App.css'
import Invoice from '../components/invoice/invoice'
import NewInvoice from '../components/invoice/new-invoice'
import AllInvoices from '../components/invoice/all-invoices'

class InvoicesContainer extends Component {
  constructor (props) {
    super(props)
    Object.assign(this, props)
    this.setActiveMenu('all')
  }
  render () {
    return (
      <Switch>
        <Route exact path='/invoices' render={() => this.renderAllInvoices()} />
        <Route exact path='/invoices/new' render={() => this.renderNewInvoice()} />
        <Route exact path='/invoices/:id' component={Invoice} />
      </Switch>
    )
  }

  renderAllInvoices () {
    return (
      <AllInvoices setActiveMenu={this.setActiveMenu} />
    )
  }

  renderNewInvoice () {
    return (
      <NewInvoice setActiveMenu={this.setActiveMenu} />
    )
  }
}

export default InvoicesContainer
