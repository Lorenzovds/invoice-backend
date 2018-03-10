import React, { Component } from 'react'
import { Table, Icon } from 'semantic-ui-react'
import { map } from 'lodash'
import '../../App.css'

class AllInvoices extends Component {
  constructor (props) {
    super(props)
    this.getAllInvoices = props.getAllInvoices
    this.state = {
      loading: true,
      invoices: []
    }
  }

  componentDidMount () {
    this.getAllInvoices()
      .then(res => {
        const { data } = res
        this.setState({ invoices: data })
      })
      .catch(() => {
        this.setState({ loading: false, errorMessage: 'Could not load invoices' })
      })
  }
  render () {
    return (
      <div>
        { this.renderInvoiceTable() }
      </div>
    )
  }

  renderInvoiceTable () {
    return (
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan='3'>Alle facturen</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        { this.renderInvoices() }
      </Table>
    )
  }

  renderInvoices () {
    const { invoices } = this.state
    return (
      <Table.Body>
        { map(invoices, this.renderInvoiceEntry.bind(this))}
      </Table.Body>
    )
  }

  renderInvoiceEntry (invoice, index) {
    const { headers, date } = invoice
    const { company, town, street, invoiceNumber } = headers
    return (
      <Table.Row key={index}>
        <Table.Cell>
          <Icon name='bookmark outline' /> { company } - { invoiceNumber }
        </Table.Cell>
        <Table.Cell>{ town } - { street }</Table.Cell>
        <Table.Cell textAlign='right'> { new Date(date).toLocaleDateString() }</Table.Cell>
      </Table.Row>
    )
  }
}

export default AllInvoices
