import React from 'react'
import {
  Form, Table, Button
} from 'semantic-ui-react'

import { map, reduce } from 'lodash'
import { TaxOptions } from '../../constants/invoiceDefaults'

const EntryTable = ({ entries, setEntries, currentEntry, setCurrentEntry, handleEntrySubmit, saving }) => {
  return (
    <Table celled style={{ marginBottom: '30px' }}>
      <EntryTableHeader />
      <EntryTableBody entries={entries} setEntries={setEntries} />
      <EntryTableFooter
        currentEntry={currentEntry}
        setCurrentEntry={setCurrentEntry}
        handleEntrySubmit={handleEntrySubmit}
        saving={saving}
      />
    </Table>
  )
}

const EntryTableHeader = () => {
  return (
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Omschrijving</Table.HeaderCell>
        <Table.HeaderCell>Aantal</Table.HeaderCell>
        <Table.HeaderCell>Prijs</Table.HeaderCell>
        <Table.HeaderCell>BTW %</Table.HeaderCell>
        <Table.HeaderCell>Totaal</Table.HeaderCell>
        <Table.HeaderCell />
      </Table.Row>
    </Table.Header>
  )
}

const EntryTableBody = ({ entries }) => {
  return (
    <Table.Body>
      {map(entries, (entry, index) => <EntryTableEntry entry={entry} index={index} />)}
      <EntryTableTotalEntry entries={entries} />
    </Table.Body>
  )
}

const EntryTableFooter = ({ currentEntry, setCurrentEntry, handleEntrySubmit, saving }) => {
  const { description, amount, price, tax } = currentEntry

  const handleEntryChange = (e, { name, value }) => {
    const newEntry = { ...currentEntry, [name]: value }
    setCurrentEntry(newEntry)
  }

  return (
    <Table.Footer>
      <Table.Row>
        <Table.HeaderCell>
          <Form.Input onChange={handleEntryChange} name='description' placeholder='Omschrijving' value={description} />
        </Table.HeaderCell>
        <Table.HeaderCell>
          <Form.Input onChange={handleEntryChange} name='amount' placeholder='Aantal' value={amount} />
        </Table.HeaderCell>
        <Table.HeaderCell>
          <Form.Input onChange={handleEntryChange} name='price' placeholder='Prijs' value={price} />
        </Table.HeaderCell>
        <Table.HeaderCell>
          <Form.Dropdown onChange={handleEntryChange} name='tax' placeholder='BTW' value={tax} options={TaxOptions} />
        </Table.HeaderCell>
        <Table.HeaderCell textAlign='center'>
          <Form onSubmit={handleEntrySubmit}>
            <Button disabled={saving} style={{ height: '50%' }} positive circular icon='plus square outline' />
          </Form>
        </Table.HeaderCell>
        <Table.HeaderCell />
      </Table.Row>
    </Table.Footer>
  )
}

const EntryTableEntry = ({ entry, index }) => {
  const { description, amount, price, tax } = entry

  const totalPrice = calculatePrice(amount, price, tax)

  return (
    <Table.Row key={index}>
      <Table.Cell>{description}</Table.Cell>
      <Table.Cell>{amount}</Table.Cell>
      <Table.Cell>{price}</Table.Cell>
      <Table.Cell>{tax}</Table.Cell>
      <Table.Cell>{totalPrice}</Table.Cell>
      <Table.Cell>
        <Button style={{ height: '50%' }} negative circular icon='trash' onClick={() => deleteEntry(index)} />
      </Table.Cell>
    </Table.Row>
  )
}

const EntryTableTotalEntry = ({ entries }) => {
  return (
    <Table.Row textAlign='right'>
      <Table.Cell colSpan='6' positive style={{ fontSize: '150%', paddingTop: '20px', borderTop: '2px solid black' }}>
        {getTotalAmount(entries).toFixed(2)}
      </Table.Cell>
    </Table.Row>
  )
}

const getTotalAmount = (entries) => {
  return reduce(entries, (acc, entry) => {
    const { amount, price, tax } = entry
    const totalPrice = calculatePrice(amount, price, tax)
    acc += totalPrice
    return acc
  }, 0)
}

const calculatePrice = (amount, price, tax) => {
  return parseFloat(((parseFloat(amount, 10) * parseFloat(price, 10)) * (1 + (parseFloat(tax, 10) / 100))).toFixed(2))
}

export default EntryTable
