import React, { Component } from 'react'
import { Table, Button, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { map, orderBy } from 'lodash'

const typeMap = {
  offer: 'Offerte',
  invoice: 'Factuur'
}

class AllInvoices extends Component {
  constructor (props) {
    super(props)
    this.getAllInvoices = props.getAllInvoices
    this.deleteInvoice = props.deleteInvoice
    this.state = {
      loading: true,
      invoices: []
    }
  }

  componentDidMount () {
    this._fetchAllInvoices()
  }

  _fetchAllInvoices () {
    this.setState({ loading: true })
    this.getAllInvoices()
      .then(res => {
        const { data } = res
        const sortedInvoices = orderBy(data, ['date'], ['desc'])
        this.setState({ invoices: sortedInvoices, loading: false })
      })
      .catch(() => {
        this.setState({ loading: false, errorMessage: 'Kon facturen niet inladen' })
      })
  }

  render () {
    return (
      <Segment basic loading={this.state.loading}>
        {this.renderInvoiceTable()}
      </Segment>
    )
  }

  renderInvoiceTable () {
    return (
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan='2'>Alle facturen / offertes</Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>Aangemaakt op</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {this.renderInvoices()}
      </Table>
    )
  }

  renderInvoices () {
    const { invoices } = this.state
    return (
      <Table.Body>
        {map(invoices, this.renderInvoiceEntry.bind(this))}
      </Table.Body>
    )
  }

  renderInvoiceEntry (invoice, index) {
    const { headers, date, _id, type } = invoice
    const { company, town, street, invoiceNumber } = headers
    const displayType = typeMap[type] || 'geen type'
    return (
      <Table.Row key={index}>
        <Table.Cell>
          <Link to={`invoices/${_id}`}>
            <Button circular icon='pencil' />
          </Link>
          {company} - {invoiceNumber} ({displayType})
        </Table.Cell>
        <Table.Cell>{town} - {street}</Table.Cell>
        <Table.Cell textAlign='right'>
          {new Date(date).toLocaleDateString()}
          <Button style={{ marginLeft: '10px' }} onClick={this.handleDelete.bind(this, _id)} circular icon='trash' />
        </Table.Cell>
      </Table.Row>
    )
  }

  handleDelete (id) {
    this.setState({ deleteLoading: true })
    this.deleteInvoice(id)
      .then(() => {
        this.setState({ deleteLoading: false })
        this._fetchAllInvoices()
      })
      .catch(() => this.setState({ deleteLoading: false }))
  }
}

export default AllInvoices
