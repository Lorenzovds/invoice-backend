import React, { useState, useEffect, useCallback } from 'react'
import { Table, Button, Segment, Message } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { map, orderBy } from 'lodash'

const typeMap = {
  offer: 'Offerte',
  invoice: 'Factuur'
}

const AllInvoices = ({ getAllInvoices, deleteInvoice, error, setActiveMenu }) => {
  const [loading, setLoading] = useState(true)
  const [invoices, setInvoices] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  const handleDelete = async (id) => {
    setLoading(true)

    try {
      await deleteInvoice(id)
      await fetchInvoices()
    } catch (err) {
      console.error(err, 'failed to delete invoice')
      setErrorMessage('Kon facturen niet inladen')
    }

    setLoading(false)
  }

  const fetchInvoices = useCallback(async () => {
    setLoading(false)

    const fetchedInvoices = await getAllInvoices()
    const sortedInvoices = orderBy(fetchedInvoices, ['date'], ['desc'])

    setInvoices(sortedInvoices)
    setLoading(false)
  }, [getAllInvoices])

  useEffect(() => {
    setErrorMessage(error || '')
    fetchInvoices()
  }, [error, fetchInvoices])

  return (
    <Segment basic loading={loading}>
      {
        errorMessage &&
          <Message color='red'>{errorMessage}</Message>
      }
      <InvoiceTable invoices={invoices} handleDelete={handleDelete} />
    </Segment>
  )
}

const InvoiceTable = ({ invoices, handleDelete }) => {
  return (
    <Table celled striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan='2'>Alle facturen / offertes</Table.HeaderCell>
          <Table.HeaderCell textAlign='right'>Aangemaakt op</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Invoices invoices={invoices} handleDelete={handleDelete} />
    </Table>
  )
}

const Invoices = ({ invoices, handleDelete }) => {
  return (
    <Table.Body>
      {
        map(invoices, (invoice, index) => {
          return (
            <InvoiceEntry
              invoice={invoice}
              key={index}
              handleDelete={handleDelete}
            />
          )
        })
      }
    </Table.Body>
  )
}

const InvoiceEntry = ({ invoice, handleDelete }) => {
  const { headers, date, _id, type } = invoice
  const { company, town, street, invoiceNumber } = headers
  const displayType = typeMap[type] || 'geen type'

  return (
    <Table.Row>
      <Table.Cell>
        <Link to={`invoices/${_id}`}>
          <Button circular icon='pencil' />
        </Link>
        {company} - {invoiceNumber} ({displayType})
      </Table.Cell>
      <Table.Cell>{town} - {street}</Table.Cell>
      <Table.Cell textAlign='right'>
        {new Date(date).toLocaleDateString()}
        <Button style={{ marginLeft: '10px' }} onClick={handleDelete.bind(this, _id)} circular icon='trash' />
      </Table.Cell>
    </Table.Row>
  )
}

export default AllInvoices
