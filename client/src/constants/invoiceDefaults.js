import moment from 'moment'

const EntryDefaults = {
  description: '',
  amount: '',
  price: '',
  tax: '21'
}

const HeaderDefaults = {
  btw: '',
  company: '',
  expireDate: moment(),
  invoiceDate: moment(),
  invoiceNumber: '',
  street: '',
  town: ''
}

const TaxOptions = [
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

const InvoiceTypes = [
  {
    text: 'Factuur',
    value: 'invoice'
  },
  {
    text: 'Offerte',
    value: 'offer'
  }
]

export {
  EntryDefaults,
  HeaderDefaults,
  TaxOptions,
  InvoiceTypes
}
