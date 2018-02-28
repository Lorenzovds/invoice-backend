import React, { Component } from 'react'
import _ from 'lodash'
import './App.css'

class App extends Component {
  componentDidMount () {
    this.getAllInvoices()
      .then(invoices => {
        this.setState({ invoices })
      })
      .catch(err => console.log(err))
  }

  async getAllInvoices () {
    const response = await fetch('/invoices') // eslint-disable-line
    const body = await response.json()
    if (response.status !== 200) throw Error(body.message)
    return body
  }

  renderInvoice (invoice) {
    return <li>{invoice.name}</li>
  }

  render () {
    if (!this.state) return null
    const { invoices } = this.state
    return (
      <div>
        <ul>
          {_.map(invoices, invoice => this.renderInvoice(invoice))}
        </ul>
      </div>
    )
  }
}

export default App
