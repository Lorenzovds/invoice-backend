import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import '../App.css'
import Invoice from '../components/invoice/invoice'
import NewInvoice from '../components/invoice/new-invoice'
import AllInvoices from '../components/invoice/all-invoices'
import { withAuth } from '@okta/okta-react'
import axios from 'axios'

class InvoicesContainer extends Component {
  constructor (props) {
    super(props)
    Object.assign(this, props)
    this.setActiveMenu('all')
    this.auth = props.auth
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
      <NewInvoice setActiveMenu={this.setActiveMenu} postInvoice={this.postInvoice.bind(this)} />
    )
  }

  postInvoice (invoice) {
    const { auth } = this
    return auth.getAccessToken()
      .then(accessToken => {
        return axios.post('/invoices', invoice, {
          headers: { accessToken }
        })
      })
  }
}

export default withAuth(InvoicesContainer)
