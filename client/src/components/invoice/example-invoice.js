import React, { Component } from 'react'
import { Segment, Image, Dropdown, Container, Button, Table, Header, Message } from 'semantic-ui-react'
// TODO revert back to the original lib, currently issues with google chrome
import domtoimage from '../../lib/dom-to-image.min.js'
import JsPdf from 'jspdf'
import moment from 'moment'
import { map, find, reduce, slice, each, get } from 'lodash'
import '../../App.css'
import '../../invoice.css'
import typeOptions from '../../constants/invoiceTypes'

const INTRO_CAP = 7
const PAGE_CAP = 18

class ExampleInvoice extends Component {
  constructor (props) {
    super(props)
    this.getAllInvoices = props.getAllInvoices
    this.setActiveMenu = props.setActiveMenu
    this.getUserInfo = props.getUserInfo
    this.invoicePagesDOM = []
    this.state = {
      loading: true,
      invoices: [],
      selectedInvoice: undefined,
      user: {}
    }
  }

  componentWillMount () {
    this.setActiveMenu('clean')
  }

  componentDidMount () {
    const invoicesPromise = this.getAllInvoices()
      .catch(err => {
        this.setState({ loadingError: 'kon facturen niet inladen' })
        throw err
      })
    const userPromise = this.getUserInfo()
      .catch(err => {
        this.setState({ loadingError: 'kon gebruikersinfo niet inladen' })
        throw err
      })

    Promise.all([invoicesPromise, userPromise])
      .then(([invoicesRes, userRes]) => {
        const { data: invoicesData } = invoicesRes
        const { data: userData } = userRes
        this.setState({
          invoices: invoicesData,
          user: userData,
          loading: false
        })
      })
      .catch(() => {
        this.setState({ loading: false })
        console.error(`failed to load necessary info`)
      })
  }

  render () {
    const { loading, invoices, selectedInvoice, loadingError, user } = this.state
    const { terms } = user
    const dropdownOptions = map(invoices, invoice => {
      const { headers, type } = invoice
      const { company, invoiceNumber } = headers
      const { text: displayType } = this.getDisplayType(type)
      return {
        text: `${company} - ${invoiceNumber} (${displayType})`,
        value: invoice._id
      }
    })
    const shouldRenderDescription = get(selectedInvoice, 'description')
    return (
      <Segment basic loading={loading}>
        <Container textAlign='right' style={{display: 'table', marginLeft: 'auto'}}>
          <Dropdown selection onChange={this.handleDropdownChange.bind(this)} options={dropdownOptions} />
          <Button content='Download' disabled={!selectedInvoice} primary onClick={this.handleExport.bind(this)} />
        </Container>
        <Container className='invoice' style={{ minWidth: '595.28px', width: '595.28px', height: 'auto' }}>
          <div ref={(input) => { this.invoiceDOM = input }} >
            { selectedInvoice && this.renderInvoiceHeader() }
            { selectedInvoice && shouldRenderDescription && this.renderInvoiceDescription()}
            { selectedInvoice && !shouldRenderDescription && this.renderInvoiceTable(0) }
          </div>
          <div>
            { selectedInvoice && this.renderPagedInvoiceTables(shouldRenderDescription) }
          </div>
          {
            terms &&
            <div ref={(input) => { this.generalDOM = input }}>
              { this.getGeneralInfo() }
            </div>
          }
        </Container>
        {
          (loadingError) && (
            <Message
              negative>
              <Message.Header>Oeps</Message.Header>
              <Message.Content>{loadingError}</Message.Content>
            </Message>
          )
        }
      </Segment>
    )
  }

  getDisplayType (type) {
    return find(typeOptions, { value: type }, { text: 'unknown type' })
  }

  handleDropdownChange (e, {value}) {
    const { invoices } = this.state
    const selectedInvoice = find(invoices, {'_id': value})
    const { description } = selectedInvoice
    let currentPage = 0
    // if description exists don't limit first entries to less
    const INTRO_LIMIT = description ? PAGE_CAP : INTRO_CAP
    const pagedInvoices = reduce(selectedInvoice.entries, (acc, entry, index) => {
      if (index === (PAGE_CAP * currentPage + INTRO_LIMIT)) {
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
    const { text: displayType } = this.getDisplayType(type)

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
        if (generalDOM) {
          return domtoimage.toPng(generalDOM, { quality: 1 })
            .then(generalUrl => {
              doc.addPage()
              doc.addImage(generalUrl, 'PNG', 0, 0, generalDOM.clientWidth, generalDOM.clientHeight)
            })
        }
        return Promise.resolve()
      })
      .then(() => {
        doc.save(`${displayType}_${company}_${invoiceNumber}`)
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error)
      })
  }

  renderInvoiceHeader () {
    const headerStyle = {
      marginTop: '-10px'
    }
    const { selectedInvoice, user } = this.state
    const {
      name: userName,
      street: userStreet,
      number: userStreetNumber,
      town: userTown,
      zipcode: userZip,
      phone: userPhone,
      mail: userMail,
      taxNr: userTax,
      iban: userIban,
      bic: userBic,
      logo: userLogo
    } = user
    if (!selectedInvoice) return null
    const { headers } = selectedInvoice
    const { company, street, town, btw, invoiceNumber, invoiceDate, expireDate } = headers
    return (
      <div>
        <Container style={{display: 'inline-flex'}}>
          <Image style={{width: '200px', height: '200px'}} src={`/${userLogo}.png`} size='tiny' />
          <Container textAlign='left' style={{height: 'auto', paddingTop: '40px', paddingLeft: '10px'}}>
            <p style={headerStyle}> {userName}</p>
            <p style={headerStyle}> {userStreet} {userStreetNumber}</p>
            <p style={headerStyle}> {userZip} {userTown}</p>
            <p><b>Tel:</b> {userPhone}</p>
            <p style={headerStyle}><b>E-mail:</b> {userMail}</p>
            <p><b>BTWnr:</b> {userTax}</p>
            <p style={headerStyle}><b>IBAN:</b> {userIban}</p>
            <p style={headerStyle}><b>BIC:</b> {userBic}</p>
          </Container>
        </Container>
        <Segment className='invoice' basic floated='right' style={{marginRight: '100px', marginBottom: '0px', width: 'auto'}}>
          <Header as='h4'>Klantinfo</Header>
          <p>{company}</p>
          <p style={headerStyle}>{street}</p>
          <p style={headerStyle}>{town}</p>
        </Segment>
        <Container style={{display: 'inline-flex', paddingLeft: '40px', paddingRight: '40px', paddingTop: '10px'}} textAlign='left'>
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
    const { pagedInvoices, selectedInvoice } = this.state
    const { description } = selectedInvoice
    const SLICE_INDEX = description ? 0 : 1
    if (!pagedInvoices) return null
    const sliced = slice(pagedInvoices, SLICE_INDEX)
    return map(sliced, (part, index) => {
      return (
        <div key={index} ref={(input) => { this.invoicePagesDOM.push(input) }}>
          { this.renderInvoiceTable(index, sliced) }
        </div>
      )
    })
  }

  renderInvoiceTable (index, invoiceEntries) {
    const allInvoiceEntries = invoiceEntries || this.state.pagedInvoices || []
    const invoicesToUse = allInvoiceEntries[index]
    if (!invoicesToUse) return null
    return (
      <div style={{paddingLeft: '40px', paddingRight: '40px', paddingTop: '40px'}}>
        <Table celled>
          {this.renderTableHeader()}
          {this.renderTableBody(invoicesToUse, index, allInvoiceEntries)}
        </Table>
      </div>
    )
  }

  renderInvoiceDescription () {
    const { selectedInvoice } = this.state
    const { description = '' } = selectedInvoice
    return <div style={{maxHeight: 375, overflow: 'hidden', paddingLeft: '40px', paddingRight: '40px', paddingTop: '40px', whiteSpace: 'pre-wrap'}}>
      { description }
    </div>
  }

  renderTableHeader () {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Omschrijving</Table.HeaderCell>
          <Table.HeaderCell>Aantal</Table.HeaderCell>
          <Table.HeaderCell>Prijs</Table.HeaderCell>
          <Table.HeaderCell>BTW %</Table.HeaderCell>
          <Table.HeaderCell>Totaal (Excl. BTW)</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    )
  }

  renderTableBody (entries, index, allInvoiceEntries) {
    return (
      <Table.Body>
        { map(entries, this.renderTableEntry.bind(this))}
        { ((allInvoiceEntries.length - 1) === index) && (this.renderTotalExclTaxEntry(entries))}
        { ((allInvoiceEntries.length - 1) === index) && (this.renderTotalTax(entries))}
        { ((allInvoiceEntries.length - 1) === index) && (this.renderTotalEntry(entries))}
      </Table.Body>
    )
  }

  renderTableEntry (entry, index) {
    const { description, amount, price, tax } = entry
    const totalPrice = this.calculatePrice(amount, price, tax)
    return (
      <Table.Row textAlign='right' key={index}>
        <Table.Cell>{description}</Table.Cell>
        <Table.Cell>{amount}</Table.Cell>
        <Table.Cell>{price}</Table.Cell>
        <Table.Cell>{tax}</Table.Cell>
        <Table.Cell>{totalPrice}</Table.Cell>
      </Table.Row>
    )
  }

  renderTotalTax (entries) {
    return (
      <Table.Row textAlign='right' style={{paddingTop: '40px', 'borderTop': '2px solid black', 'backgroundColor': 'rgba(217,219,188, 0.6)'}}>
        <Table.Cell>Totaal BTW</Table.Cell>
        <Table.Cell colSpan='4'>
          { this.getTotalTax(entries).toFixed(2)}
        </Table.Cell>
      </Table.Row>
    )
  }

  renderTotalExclTaxEntry (entries) {
    return (
      <Table.Row textAlign='right' style={{paddingTop: '40px', 'borderTop': '2px solid black', 'backgroundColor': 'rgba(217,219,188, 0.6)'}}>
        <Table.Cell>Totaal Excl. BTW</Table.Cell>
        <Table.Cell colSpan='4'>
          { this.getTotalAmount(entries).toFixed(2)}
        </Table.Cell>
      </Table.Row>
    )
  }

  renderTotalEntry (entries) {
    const total = this.getTotalAmount(entries) + this.getTotalTax(entries)
    return (
      <Table.Row textAlign='right' style={{paddingTop: '40px', 'borderTop': '2px solid black', 'backgroundColor': 'rgba(184,216,186, 0.6)'}}>
        <Table.Cell>Totaal te betalen</Table.Cell>
        <Table.Cell colSpan='4'>
          { total.toFixed(2) }
        </Table.Cell>
      </Table.Row>
    )
  }

  calculatePrice (amount, price) {
    return amount * price
  }

  calculateTax (amount, price, tax) {
    return (amount * price) * (tax / 100)
  }

  getTotalAmount () {
    const { entries } = this.state.selectedInvoice
    return reduce(entries, (acc, entry) => {
      const { amount, price } = entry
      acc += this.calculatePrice(amount, price)
      return acc
    }, 0)
  }

  getTotalTax () {
    const { entries } = this.state.selectedInvoice
    return reduce(entries, (acc, entry) => {
      const { amount, price, tax } = entry
      acc += this.calculateTax(amount, price, tax)
      return acc
    }, 0)
  }

  getGeneralInfo () {
    const { selectedInvoice, user } = this.state
    const { terms } = user
    if (!selectedInvoice) return null
    return (
      <div style={{paddingLeft: '40px', paddingRight: '40px', paddingTop: '40px'}}>
        <div dangerouslySetInnerHTML={{__html: terms}} />
      </div>
    )
  }
}

export default ExampleInvoice
