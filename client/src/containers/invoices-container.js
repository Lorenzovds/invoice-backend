import React, { Component } from 'react'
import { Route, Switch } from 'react-router'
import '../App.css'
import NewInvoice from '../components/invoice/new-invoice'
import AllInvoices from '../components/invoice/all-invoices'
import ExampleInvoice from '../components/invoice/example-invoice'
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
        <Route exact path='/invoices/clean' render={() => this.renderExampleInvoices()} />
        <Route exact path='/invoices/:id' render={() => this.renderEditInvoice()} />
      </Switch>
    )
  }

  renderAllInvoices () {
    return (
      <AllInvoices setActiveMenu={this.setActiveMenu} getAllInvoices={this.getAllInvoices.bind(this)} />
    )
  }

  renderExampleInvoices () {
    return (
      <ExampleInvoice setActiveMenu={this.setActiveMenu} getAllInvoices={this.getAllInvoices.bind(this)} />
    )
  }

  renderNewInvoice () {
    return (
      <NewInvoice setActiveMenu={this.setActiveMenu} postInvoice={this.postInvoice.bind(this)} />
    )
  }

  renderEditInvoice () {
    return (
      <NewInvoice setActiveMenu={this.setActiveMenu} updateInvoice={this.updateInvoice.bind(this)} getInvoice={this.getInvoice.bind(this)} />
    )
  }

  postInvoice (invoice) {
    const { auth } = this
    return auth.getAccessToken()
      .then(accessToken => {
        return axios.post('/api/invoices', invoice, {
          headers: { accessToken }
        })
      })
  }

  updateInvoice (invoice, id) {
    const { auth } = this
    return auth.getAccessToken()
      .then(accessToken => {
        return axios.put(`/api/invoices/${id}`, invoice, {
          headers: { accessToken }
        })
      })
  }

  getAllInvoices () {
    const { auth } = this
    return auth.getAccessToken()
      .then(accessToken => {
        return axios.get('/api/invoices', {
          headers: { accessToken }
        })
      })
  }

  getInvoice (id) {
    const { auth } = this
    return auth.getAccessToken()
      .then(accessToken => {
        return axios.get(`/api/invoices/${id}`, {
          headers: { accessToken }
        })
      })
  }
}

export default withAuth(InvoicesContainer)
