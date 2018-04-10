import React, { Component } from 'react'
import { Segment, Image, Dropdown, Container, Button, Table } from 'semantic-ui-react'
import domtoimage from 'dom-to-image'
import JsPdf from 'jspdf'
import moment from 'moment'
import { map, find, reduce, slice, each } from 'lodash'
import '../../App.css'

const INTRO_CAP = 7
const PAGE_CAP = 17

class ExampleInvoice extends Component {
  constructor (props) {
    super(props)
    this.getAllInvoices = props.getAllInvoices
    this.setActiveMenu = props.setActiveMenu
    this.invoicePagesDOM = []
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
      const { headers, type } = invoice
      const { company, invoiceNumber } = headers
      const displayType = this.getDisplayType(type)
      return {
        text: `${company} - ${invoiceNumber} (${displayType})`,
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
          <div ref={(input) => { this.invoiceDOM = input }} >
            { this.renderInvoiceHeader() }
            { this.renderInvoiceTable(0) }
          </div>
          <div>
            { this.renderPagedInvoiceTables() }
          </div>
          <div ref={(input) => { this.generalDOM = input }}>
            { this.getGeneralInfo() }
          </div>
        </Container>
      </Segment>
    )
  }

  getDisplayType (type) {
    const typeMap = {
      'offer': 'Offerte',
      'invoice': 'Factuur'
    }
    return typeMap[type]
  }

  handleDropdownChange (e, {value}) {
    const { invoices } = this.state
    const selectedInvoice = find(invoices, {'_id': value})
    let currentPage = 0
    const pagedInvoices = reduce(selectedInvoice.entries, (acc, entry, index) => {
      if (index === (PAGE_CAP * currentPage + INTRO_CAP)) {
        ++currentPage
        acc[currentPage] = []
      }
      acc[currentPage].push(entry)
      return acc
    }, [[]])

    this.setState({ selectedInvoice, pagedInvoices })
  }

  handleExport () {
    const { invoiceDOM, generalDOM, invoicePagesDOM, state } = this
    const { selectedInvoice } = state
    const { headers, type } = selectedInvoice
    const { company, invoiceNumber } = headers
    const doc = new JsPdf('p', 'pt', 'a4')
    const displayType = this.getDisplayType(type)

    domtoimage.toPng(invoiceDOM, { quality: 1 })
      .then(async (dataUrl) => {
        doc.addImage(dataUrl, 'PNG', 0, 0, invoiceDOM.clientWidth, invoiceDOM.clientHeight)
        const generatePages = await Promise.all(map(invoicePagesDOM, async (page, index) => {
          const pageUrl = await domtoimage.toPng(page, { quality: 1 })
          return {pageUrl, page}
        }))
        return generatePages
      })
      .then(pages => {
        each(pages, ({pageUrl, page}) => {
          doc.addPage()
          doc.addImage(pageUrl, 'PNG', 0, 0, page.clientWidth, page.clientHeight)
        })
      })
      .then(() => {
        return domtoimage.toPng(generalDOM, { quality: 1 })
          .then(generalUrl => {
            doc.addPage()
            doc.addImage(generalUrl, 'PNG', 0, 0, generalDOM.clientWidth, generalDOM.clientHeight)
            doc.save(`${displayType}_${company}_${invoiceNumber}`)
          })
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error)
      })
  }

  renderInvoiceHeader () {
    const headerStyle = {
      marginTop: '-10px'
    }
    const { selectedInvoice } = this.state
    if (!selectedInvoice) return null
    const { headers } = selectedInvoice
    const { company, street, town, btw, invoiceNumber, invoiceDate, expireDate } = headers
    return (
      <div>
        <Container style={{display: 'inline-flex'}}>
          <Image style={{width: '200px', height: '200px'}} src='/test-logo.png' size='tiny' />
          <Container textAlign='left' style={{width: 'auto', height: 'auto', paddingTop: '40px'}}>
            <p style={headerStyle}>Van Doorsselaere Kevin</p>
            <p style={headerStyle}>Bieststraat 68</p>
            <p style={headerStyle}>9270 Kalken</p>
            <p style={headerStyle}>Tel: 0497 35 77 98</p>
            <p style={headerStyle}><b>E-mail:</b></p>
            <p style={headerStyle}>Kevin_van_Doorsselaere@hotmail.com</p>
            <p style={headerStyle}><b>BTWnr:</b> BE  0690.876.560</p>
            <p style={headerStyle}><b>IBAN:</b> BE67 0018 3341 5487</p>
            <p style={headerStyle}><b>BIC:</b> GEBABEBB</p>
          </Container>
          <Container style={{width: 'auto', height: 'auto', paddingTop: '40px'}}>
            <p>{company}</p>
            <p>{street}</p>
            <p>{town}</p>
          </Container>
        </Container>
        <Container style={{display: 'inline-flex', paddingLeft: '40px', paddingRight: '40px', paddingTop: '40px'}} textAlign='left'>
          <Container>
            <Table style={{width: '100%'}}>
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
                  <Table.Cell>{moment.unix(invoiceDate).format('DD/MM/YYYY')}</Table.Cell>
                  <Table.Cell>{moment.unix(expireDate).format('DD/MM/YYYY')}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Container>
        </Container>
      </div>
    )
  }

  renderPagedInvoiceTables () {
    const { pagedInvoices } = this.state
    if (!pagedInvoices) return null
    const sliced = slice(pagedInvoices, 1)
    return map(sliced, (part, index) => {
      return (
        <div key={index} ref={(input) => { this.invoicePagesDOM.push(input) }}>
          { this.renderInvoiceTable(++index) }
        </div>
      )
    })
  }

  renderInvoiceTable (index) {
    const { selectedInvoice, pagedInvoices } = this.state
    if (!selectedInvoice) return null
    const invoicesToUse = pagedInvoices[index]
    if (!invoicesToUse) return null
    return (
      <div style={{paddingLeft: '40px', paddingRight: '40px', paddingTop: '40px'}}>
        <Table celled>
          {this.renderTableHeader()}
          {this.renderTableBody(invoicesToUse, index)}
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

  renderTableBody (entries, index) {
    const { pagedInvoices } = this.state

    return (
      <Table.Body>
        { map(entries, this.renderTableEntry.bind(this))}
        { ((pagedInvoices.length - 1) === index) && (this.renderTotalEntry(entries))}
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
      <Table.Row textAlign='right' positive style={{paddingTop: '40px', 'borderTop': '2px solid black'}}>
        <Table.Cell>Totaal</Table.Cell>
        <Table.Cell colSpan='4'>
          { this.getTotalAmount(entries).toFixed(2)}
        </Table.Cell>
      </Table.Row>
    )
  }

  calculatePrice (amount, price, tax) {
    return parseFloat(((parseFloat(amount, 10) * parseFloat(price, 10)) * (1 + (parseFloat(tax, 10) / 100))).toFixed(2))
  }

  getTotalAmount () {
    const { entries } = this.state.selectedInvoice
    return reduce(entries, (acc, entry) => {
      const { amount, price, tax } = entry
      const totalPrice = this.calculatePrice(amount, price, tax)
      acc += totalPrice
      return acc
    }, 0)
  }

  getGeneralInfo () {
    const { selectedInvoice } = this.state
    if (!selectedInvoice) return null
    return (
      <div style={{paddingLeft: '40px', paddingRight: '40px', paddingTop: '40px'}}>
        <h4>Algemene verkoopsvoorwaarden</h4>
        <ol>
          <li>De facturen zijn betaalbaar netto, binnen de 15 dagen na factuurdatum.</li>
          <li>In geval van niet-betaling op de vervaldatum, zal vanaf deze vervaldatum van rechtswege en zonder ingebrekestelling, verwijlintresten aan 12% per jaar verschuldigd.</li>
          <li>Indien binnen de 5 werkdagen geen gevolg gegeven wordt aan een aangetekend schrijven tot aanmaning, zal benevens de verwijlintresten, het bedrag van iedere achterstallige factuur van rechtswege verhoogd worden met 15 %, met een minimum van € 50 per factuur.</li>
          <li>Klachten betreffende leveringen dienen schriftelijk te gebeuren binnen de 2 werkdagen na levering. Iedere teruggave moet omschreven worden met volgende gegevens: datum van levering, nummer van de zendnota en aard van de schade (breuk of manco).</li>
          <li>De geleverde goederen blijven eigendom van de leverancier (verkoper) tot volledige betaling is geschied van de verschuldigde hoofdsom, plus eventuele kosten en intresten. De levering gebeurt evenwel op risico van de koper, die zich tegen mogelijke schadegevallen hoort te verzekeren. De koper zal de leverancier (verkoper) verwittigen indien de goederen geplaatst worden in een ruimte die door de koper wordt gehuurd. Desgevallend zal hij de identiteit en de woonplaats van de verhuurder bekendmaken, zodat de leverancier hem op zijn eigendomsvoorbehoud kan wijzen.</li>
          <li>Bij gebeurlijke geschillen is alleen de Rechtbank van Koophandel te Dendermonde bevoegd.</li>
        </ol>
      </div>
    )
  }
}

export default ExampleInvoice
