const mongoose = require('mongoose')
const Schema = mongoose.Schema

const invoiceSchema = new Schema({
  entries: [],
  headers: {},
  user: {},
  date: { type: Date, default: new Date() }
})

const Invoice = mongoose.model('Invoice', invoiceSchema)

module.exports = Invoice
