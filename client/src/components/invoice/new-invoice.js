import React, { Component } from 'react'
import { Header, Form, Container, Table, Button } from 'semantic-ui-react'
import { map } from 'lodash'
import '../../App.css'
const taxOptions = [
  {
    text: '0',
    value: '0'
  },
  {
    text: '6',
    value: '6'
  },
  {
    text: '12',
    value: '12'
  },
  {
    text: '21',
    value: '21'
  }
]

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
        <div>{ this.headerForm() }</div>
        <div>{ this.renderTable() }</div>
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
      <Table celled style={{marginBottom: '30px'}}>
        {this.renderTableHeader()}
        {this.renderTableBody()}
        {this.renderTableFooter()}
      </Table>
    )
  }

  renderTableHeader () {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Omschrijving</Table.HeaderCell>
          <Table.HeaderCell>Aantal</Table.HeaderCell>
          <Table.HeaderCell>Prijs</Table.HeaderCell>
          <Table.HeaderCell>BTW %</Table.HeaderCell>
          <Table.HeaderCell>Totaal</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    )
  }

  renderTableBody () {
    return (
      <Table.Body>
        { map(this.state.entries, this.renderTableEntry.bind(this))}
      </Table.Body>
    )
  }

  renderTableFooter () {
    return (
      <Table.Footer>
        <Table.Row>
          <Table.HeaderCell>
            <Form.Input onChange={this.handleEntryChange.bind(this)} name='description' placeholder='Omschrijving' />
          </Table.HeaderCell>
          <Table.HeaderCell>
            <Form.Input onChange={this.handleEntryChange.bind(this)} name='amount' placeholder='Aantal' />
          </Table.HeaderCell>
          <Table.HeaderCell>
            <Form.Input onChange={this.handleEntryChange.bind(this)} name='price' placeholder='Prijs' />
          </Table.HeaderCell>
          <Table.HeaderCell>
            <Form.Dropdown onChange={this.handleEntryChange.bind(this)} name='tax' placeholder='BTW' value='21' options={taxOptions} />
          </Table.HeaderCell>
          <Table.HeaderCell textAlign='center'>
            <Form onSubmit={this.handleEntrySubmit.bind(this)}>
              <Button style={{'height': '50%'}} positive circular icon='plus square outline' />
            </Form>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
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
