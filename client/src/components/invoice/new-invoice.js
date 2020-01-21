import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import {
  Header, Form, Button,
  Message, Segment, Dropdown, TextArea, Popup, Icon
} from 'semantic-ui-react'
import { cloneDeep, filter, get } from 'lodash'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import EntryTable from './entry-table'

import styles from './new-invoice.module.css'

import {
  parseHeadersOut,
  parseHeadersIn,
  parseEntriesOut,
  validateHeaders,
  validateEntry
} from '../../lib/invoice-parser'

import { HeaderDefaults, EntryDefaults, InvoiceTypes } from '../../constants/invoiceDefaults'

const NewInvoice = ({ postInvoice, getInvoice, updateInvoice, error, match }) => {
  const [headers, setHeaders] = useState({})
  const [currentEntry, setCurrentEntry] = useState({})
  const [type, setType] = useState(InvoiceTypes[0].value)
  const [description, setDescription] = useState('')
  const [entries, setEntries] = useState([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [edit, setEdit] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const invoiceId = get(match, 'params.id', '')

  useEffect(() => {
    // set the potentially passed errormessage
    setErrorMessage(error || '')

    // set default headers by cloning them
    setHeaders(cloneDeep(HeaderDefaults))
    setCurrentEntry(cloneDeep(EntryDefaults))

    // if no id is passed it means we are creating a new invoice
    // no need for setting up the fields
    setLoading(false)

    if (!invoiceId) return

    setLoading(true)

    // turn on edit mode
    setEdit(true)

    // fetch the invoice from the api
    getInvoice(invoiceId)
      .then(invoice => {
        const { entries, headers, type = InvoiceTypes[0].value, description } = invoice

        // parse certain header fields to a readable format
        const parsedHeaders = parseHeadersIn(headers)

        // populate all the fields
        setEntries(entries)
        setHeaders(parsedHeaders)
        setType(type)
        setDescription(description)
        setLoading(false)
      })
  }, [invoiceId, error, postInvoice, getInvoice, updateInvoice])

  const saveInvoice = () => {
    setSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    const isValid = validateHeaders(headers)

    if (!isValid) {
      setSaving(false)
      setErrorMessage('er ontbreken contact gegevens')
      return
    }

    const parsedHeaders = parseHeadersOut(headers)
    const parsedEntries = parseEntriesOut(entries)

    const body = Object.assign({},
      { entries: parsedEntries },
      { headers: parsedHeaders },
      { type }, { description })

    const savePromise = edit ? updateInvoice(body, invoiceId) : postInvoice(body)

    savePromise
      .then(() => {
        setSuccessMessage('factuur opgeslagen!')
      })

    setSaving(false)
  }

  const entrySubmit = () => {
    setErrorMessage('')

    const validEntry = validateEntry(currentEntry)
    if (!validEntry) {
      setErrorMessage('zorg dat er cijfers worden ingevuld waar nodig')
      return
    }

    setEntries([...entries, currentEntry])

    setCurrentEntry(cloneDeep(EntryDefaults))
  }

  const deleteEntry = (indexToDelete) => {
    // prefer filter because it doesn't mutate
    const filteredEntries = filter(entries, (entry, index) => index !== indexToDelete)
    setEntries(filteredEntries)
  }

  return (
    <Segment basic loading={loading}>
      {
        !loading &&
          <div>
            {/* show if in edit or new mode */}
            <Header as='h2'>
              {edit ? 'Aanpassen' : 'Nieuw'}
            </Header>
            {/* type selector */}
            <Header as='h4'>
              <Dropdown onChange={(e, { value }) => setType(value)} selection value={type} options={InvoiceTypes} />
            </Header>
            {/* header input fields */}
            <div>
              <HeaderForm
                headers={headers}
                setHeaders={setHeaders}
              />
            </div>
            {/* extra description input field */}
            <div style={{ paddingBottom: '14px' }}>
              <DescriptionField />
            </div>
            {/* entry table render */}
            <div>
              <EntryTable
                entries={entries}
                handleEntryDelete={deleteEntry}
                currentEntry={currentEntry}
                setCurrentEntry={setCurrentEntry}
                handleEntrySubmit={entrySubmit}
                saving={saving}
              />
            </div>
            {/* message render */}
            {
              (errorMessage || successMessage) && (
                <Message
                  negative={!!errorMessage}
                  positive={!errorMessage && !!successMessage}
                >
                  <Message.Header>
                    {errorMessage && <span>Oeps</span>}
                    {successMessage && <span>Success</span>}
                  </Message.Header>
                  <Message.Content>{errorMessage || successMessage}</Message.Content>
                </Message>
              )
            }
            <div className={styles['save-button-right']}>
              <Button
                disabled={!!errorMessage}
                loading={saving}
                size='medium'
                content={edit ? 'aanpassen' : 'nieuw'}
                positive onClick={() => saveInvoice()}
              />
            </div>
          </div>
      }
    </Segment>
  )
}

const HeaderForm = ({ headers, setHeaders }) => {
  const { company, street, town, btw, invoiceNumber, invoiceDate, expireDate } = headers

  const handleHeaderChange = (e, { name, value }) => {
    const newHeaders = { ...headers, [name]: value }
    setHeaders(newHeaders)
  }

  const setExpireDate = (date) => {
    const newHeaders = { ...headers, expireDate: date }
    setHeaders(newHeaders)
  }

  const setInvoiceDate = (date) => {
    const newHeaders = { ...headers, invoiceDate: date }
    setHeaders(newHeaders)
  }

  return (
    <Form>
      <Form.Group>
        <Form.Input onChange={handleHeaderChange} label='Bedrijfsnaam' name='company' placeholder='Bedrijfsnaam' value={company} required width={4} />
        <Form.Input onChange={handleHeaderChange} label='Straat' name='street' placeholder='Straat' value={street} required width={4} />
        <Form.Input onChange={handleHeaderChange} label='Gemeente' name='town' placeholder='Gemeente' value={town} required width={4} />
      </Form.Group>
      <Form.Group>
        <Form.Input onChange={handleHeaderChange} label='BTW-nummer' name='btw' placeholder='BTW-nummer' value={btw} required width={4} />
        <Form.Input onChange={handleHeaderChange} label='Factuurnummer' name='invoiceNumber' placeholder='Factuurnummer' value={invoiceNumber} required width={4} />
        <Form.Field required width={2}>
          <label>Factuur datum</label>
          <DatePicker
            style={{ width: '100%' }}
            selected={invoiceDate}
            onChange={setInvoiceDate}
            dateFormat='DD/MM/YYYY'
          />
        </Form.Field>
        <Form.Field required width={2}>
          <label>Vervaldag</label>
          <DatePicker
            style={{ width: '100%' }}
            selected={expireDate}
            onChange={setExpireDate}
            dateFormat='DD/MM/YYYY'
          />
        </Form.Field>
      </Form.Group>
    </Form>
  )
}

const DescriptionField = ({ description, setDescription }) => {
  return (
    <Form>
      <Form.Field>
        <label>
            Extra informatie&nbsp;
          <Popup
            style={{ height: 'auto' }}
            trigger={<Icon color='green' name='question' />}
            content='Deze tekst komt op de eerste pagina voor de factuur tabel.'
          />
        </label>
        <TextArea
          value={description}
          rows={10}
          placeholder='extra beschrijving'
          style={{ width: '45%' }}
          onChange={(e) => setDescription(e.target.value || '')}
        />
      </Form.Field>
    </Form>
  )
}

export default withRouter(NewInvoice)
