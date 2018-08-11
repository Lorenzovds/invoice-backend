const mongoose = require('mongoose')
const Schema = mongoose.Schema

const entrySchema = new Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  tax: { type: Number, required: true }
})

const invoiceSchema = new Schema({
  entries: [entrySchema],
  headers: {},
  user: {},
  date: { type: Date, default: new Date() },
  type: { type: String, required: true }
})

const Invoice = mongoose.model('Invoice', invoiceSchema)

module.exports = Invoice
