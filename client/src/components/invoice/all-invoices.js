import React, { Component } from 'react'
import { Table, Button, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
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
        this.setState({ invoices: data, loading: false })
      })
      .catch(() => {
        this.setState({ loading: false, errorMessage: 'Could not load invoices' })
      })
  }
  render () {
    return (
      <Segment loading={this.state.loading}>
        { this.renderInvoiceTable() }
      </Segment>
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
    const { headers, date, _id } = invoice
    const { company, town, street, invoiceNumber } = headers
    return (
      <Table.Row key={index}>
        <Table.Cell>
          <Link to={`invoices/${_id}`}>
            <Button circular icon='pencil' />
          </Link>
          { company } - { invoiceNumber }
        </Table.Cell>
        <Table.Cell>{ town } - { street }</Table.Cell>
        <Table.Cell textAlign='right'> { new Date(date).toLocaleDateString() }</Table.Cell>
      </Table.Row>
    )
  }
}

export default AllInvoices
