import React, { Component } from 'react'
import { Header, Form, Container, Table, Button } from 'semantic-ui-react'
import { map } from 'lodash'
import '../../App.css'

class NewInvoice extends Component {
  constructor (props) {
    super(props)
    this.setActiveMenu = props.setActiveMenu
    this.state = {
      headers: {},
      entry: {},
      entries: []
    }
  }

  componentWillMount () {
    this.setActiveMenu('new')
  }

  render () {
    return (
      <Container fluid>
        <Header as='h2'> Nieuwe factuur</Header>
        { this.headerForm() }
        { this.renderTable() }
        { this.addRow() }
      </Container>
    )
  }

  headerForm () {
    return (
      <Form>
        <Form.Group>
          <Form.Input onChange={this.handleHeaderChange.bind(this)} label='Bedrijfsnaam' name='company' placeholder='Bedrijfsnaam' required width={4} />
          <Form.Input onChange={this.handleHeaderChange.bind(this)} label='Straat' name='street' placeholder='Straat' required width={4} />
          <Form.Input onChange={this.handleHeaderChange.bind(this)} label='Gemeente' name='town' placeholder='Gemeente' required width={4} />
        </Form.Group>
        <Form.Group>
          <Form.Input onChange={this.handleHeaderChange.bind(this)} label='BTW-nummer' name='btw' placeholder='BTW-nummer' required width={4} />
          <Form.Input onChange={this.handleHeaderChange.bind(this)} label='Factuurnummer' name='invoiceNumber' placeholder='Factuurnummer' required width={4} />
          <Form.Input onChange={this.handleHeaderChange.bind(this)} label='Factuurdatum' name='invoiceDate' placeholder='Factuurdatum' required width={4} />
          <Form.Input onChange={this.handleHeaderChange.bind(this)} label='Vervaldag' name='expireDate' placeholder='Vervaldag' required width={4} />
        </Form.Group>
      </Form>
    )
  }

  handleHeaderChange (e, {name, value}) {
    const newHeaders = Object.assign(this.state.headers, { [name]: value })
    this.setState({ headers: newHeaders })
  }

  renderTable () {
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Omschrijving</Table.HeaderCell>
            <Table.HeaderCell>Aantal</Table.HeaderCell>
            <Table.HeaderCell>Prijs</Table.HeaderCell>
            <Table.HeaderCell>BTW %</Table.HeaderCell>
            <Table.HeaderCell>Totaal</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { map(this.state.entries, this.renderTableEntry.bind(this))}
        </Table.Body>
      </Table>
    )
  }

  renderTableEntry (entry, index) {
    const { description, amount, price, tax } = entry
    const totalPrice = this.calculatePrice(amount, price, tax)
    return (
      <Table.Row key={index}>
        <Table.Cell>{description}</Table.Cell>
        <Table.Cell>{amount}</Table.Cell>
        <Table.Cell>{price}</Table.Cell>
        <Table.Cell>{tax}</Table.Cell>
        <Table.Cell>{totalPrice}</Table.Cell>
      </Table.Row>
    )
  }

  calculatePrice (amount, price, tax) {
    return (parseInt(amount, 10) * parseInt(price, 10)) * (1 + (parseInt(tax, 10) / 100))
  }

  addRow () {
    return (
      <Form onSubmit={this.handleEntrySubmit.bind(this)}>
        <Form.Group>
          <Form.Input onChange={this.handleEntryChange.bind(this)} label='Omschrijving' name='description' placeholder='Omschrijving' width={4} />
          <Form.Input onChange={this.handleEntryChange.bind(this)} label='Aantal' name='amount' placeholder='Aantal' width={4} />
          <Form.Input onChange={this.handleEntryChange.bind(this)} label='Prijs' name='price' placeholder='Prijs' width={4} />
          <Form.Input onChange={this.handleEntryChange.bind(this)} label='BTW' name='tax' placeholder='BTW' width={4} />
          <Button style={{'height': '50%', 'marginTop': '1.6%'}} positive circular icon='plus square outline' />
        </Form.Group>
      </Form>
    )
  }

  handleEntryChange (e, {name, value}) {
    const newHeaders = Object.assign(this.state.entry, { [name]: value })
    this.setState({ headers: newHeaders })
  }

  handleEntrySubmit () {
    const { entry, entries } = this.state
    entries.push(entry)
    this.setState({ entries })
  }
}

export default NewInvoice
