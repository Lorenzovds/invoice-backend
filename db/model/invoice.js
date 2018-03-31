const mongoose = require('mongoose')
const Schema = mongoose.Schema

const invoiceSchema = new Schema({
  entries: [],
  headers: {},
  user: {},
  date: { type: Date, default: new Date() },
  type: { type: String, required: true }
})

const Invoice = mongoose.model('Invoice', invoiceSchema)

module.exports = Invoice
