import React, { Component } from 'react'
import { Header, Form, Container } from 'semantic-ui-react'
import '../../App.css'

class NewInvoice extends Component {
  constructor (props) {
    super(props)
    this.setActiveMenu = props.setActiveMenu
  }

  componentWillMount () {
    this.setActiveMenu('new')
  }

  render () {
    return (
      <Container fluid>
        <Header as='h2'> Nieuwe factuur</Header>
        { this.headerForm() }
      </Container>
    )
  }

  headerForm () {
    return (
      <Form>
        <Form.Group>
          <Form.Input label='Bedrijfsnaam' name='company' placeholder='Bedrijfsnaam' required width={4} />
          <Form.Input label='Straat' name='street' placeholder='Straat' required width={4} />
          <Form.Input label='Gemeente' name='town' placeholder='Gemeente' required width={4} />
        </Form.Group>
        <Form.Group>
          <Form.Input label='BTW-nummer' name='btw' placeholder='BTW-nummer' required width={4} />
          <Form.Input label='Factuurnummer' name='invoiceNumber' placeholder='Factuurnummer' required width={4} />
          <Form.Input label='Factuurdatum' name='invoiceDate' placeholder='Factuurdatum' required width={4} />
          <Form.Input label='Vervaldag' name='expireDate' placeholder='Vervaldag' required width={4} />
        </Form.Group>
      </Form>
    )
  }
}

export default NewInvoice
