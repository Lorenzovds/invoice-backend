import React, { Component } from 'react'
import { Segment, Image, Dropdown, Container, Button, Table, Header } from 'semantic-ui-react'
import domtoimage from 'dom-to-image'
import JsPdf from 'jspdf'
import { map, find, reduce } from 'lodash'
import '../../App.css'

class ExampleInvoice extends Component {
  constructor (props) {
    super(props)
    this.getAllInvoices = props.getAllInvoices
    this.setActiveMenu = props.setActiveMenu
    this.state = {
      loading: true,
      invoices: [],
      selectedInvoice: undefined
    }
  }

  componentWillMount () {
    this.setActiveMenu('clean')
  }

  componentDidMount () {
    this.getAllInvoices()
      .then(res => {
        this.setState({ invoices: res.data, loading: false })
      })
      .catch(() => {
        this.setState({ loading: false, loadingError: 'kon facturen niet inladen' })
      })
  }

  render () {
    const { loading, invoices, selectedInvoice } = this.state
    const dropdownOptions = map(invoices, invoice => {
      return {
        text: `${invoice.headers.company} - ${invoice.headers.invoiceNumber}`,
        value: invoice._id
      }
    })
    return (
      <Segment basic loading={loading}>
        <Container textAlign='right' style={{display: 'table', marginLeft: 'auto'}}>
          <Dropdown selection onChange={this.handleDropdownChange.bind(this)} options={dropdownOptions} />
          <Button content='Download' disabled={!selectedInvoice} primary onClick={this.handleExport.bind(this)} />
        </Container>
        <Container style={{ minWidth: '595.28px', width: '595.28px', height: 'auto' }}>
          <div style={{ paddingTop: '40px' }} ref={(input) => { this.invoiceDOM = input }} >
            { this.renderInvoiceHeader() }
            { this.renderInvoiceTable() }
          </div>
        </Container>
      </Segment>
    )
  }

  handleDropdownChange (e, {value}) {
    const { invoices } = this.state
    const selectedInvoice = find(invoices, {'_id': value})
    this.setState({ selectedInvoice })
  }

  handleExport () {
    const { invoiceDOM, state } = this
    const { selectedInvoice } = state
    const { headers } = selectedInvoice
    const { company, invoiceNumber } = headers
    domtoimage.toPng(invoiceDOM)
      .then(function (dataUrl) {
        const doc = new JsPdf('p', 'pt', 'a4')
        const width = invoiceDOM.clientWidth
        const height = invoiceDOM.clientHeight
        doc.addImage(dataUrl, 'PNG', 0, 0, width, height)
        doc.save(`Factuur_${company}_${invoiceNumber}`)
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error)
      })
  }

  renderInvoiceHeader () {
    const { selectedInvoice } = this.state
    if (!selectedInvoice) return null
    const { headers } = selectedInvoice
    const { company, street, town, btw, invoiceNumber, invoiceDate, expireDate } = headers
    return (
      <div>
        <Container style={{display: 'inline-flex'}}>
          <Container style={{width: 'auto', height: 'auto'}}>
            <Image src='/test-logo.png' size='small' />
          </Container>
          <Container style={{width: 'auto', height: 'auto'}}>
            <p>Van Doorselaere Kevin</p>
            <p>Bieststraat 68</p>
            <p>9270 Kalken</p>
            <p>Tel: 0497 35 77 98</p>
            <p>E-mail: Kevin_van_Doorsselaere@hotmail.com</p>
          </Container>
          <Container style={{width: 'auto', height: 'auto'}}>
            <p>BTWnr: BE  0690.876.560</p>
            <p>IBAN: BE67 0018 3341 5487</p>
            <p>BIC: GEBABEBB</p>
          </Container>
        </Container>
        <Container textAlign='left' style={{width: 'auto', paddingLeft: '30px'}}>
          <Header as='h3'>Klantinfo</Header>
        </Container>
        <Container style={{display: 'inline-flex', paddingLeft: '30px', paddingTop: '30px'}} textAlign='left'>
          <Container style={{width: 'auto'}}>
            <p>{company}</p>
            <p>{street}</p>
            <p>{town}</p>
          </Container>
          <Container style={{paddingLeft: '30px'}}>
            <Table style={{width: 'auto'}}>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>BTW-nummer klant</Table.Cell>
                  <Table.Cell>Factuurnummer</Table.Cell>
                  <Table.Cell>Factuurdatum</Table.Cell>
                  <Table.Cell>Vervaldag</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>{btw}</Table.Cell>
                  <Table.Cell>{invoiceNumber}</Table.Cell>
                  <Table.Cell>{invoiceDate}</Table.Cell>
                  <Table.Cell>{expireDate}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Container>
        </Container>
      </div>
    )
  }

  renderInvoiceTable () {
    const { selectedInvoice } = this.state
    if (!selectedInvoice) return null
    return (
      <div style={{ margin: '10px' }}>
        <Table celled>
          {this.renderTableHeader()}
          {this.renderTableBody()}
        </Table>
      </div>
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
    const { entries } = this.state.selectedInvoice
    return (
      <Table.Body>
        { map(entries, this.renderTableEntry.bind(this))}
        { this.renderTotalEntry(entries)}
      </Table.Body>
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

  renderTotalEntry (entries) {
    return (
      <Table.Row textAlign='right'>
        <Table.Cell colSpan='5' positive style={{'fontSize': '150%', paddingTop: '20px', 'borderTop': '2px solid black'}}>
          { this.getTotalAmount(entries).toFixed(2)}
        </Table.Cell>
      </Table.Row>
    )
  }

  calculatePrice (amount, price, tax) {
    return parseFloat(((parseFloat(amount, 10) * parseFloat(price, 10)) * (1 + (parseFloat(tax, 10) / 100))).toFixed(2))
  }

  getTotalAmount (entries) {
    return reduce(entries, (acc, entry) => {
      const { amount, price, tax } = entry
      const totalPrice = this.calculatePrice(amount, price, tax)
      acc += totalPrice
      return acc
    }, 0)
  }
}

export default ExampleInvoice
