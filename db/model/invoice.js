const { isEqual } = require('lodash')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EntrySchema = new Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  tax: { type: Number, required: true }
})

const InvoiceSchema = new Schema({
  entries: [EntrySchema],
  headers: {},
  user: {},
  date: { type: Date, default: new Date() },
  type: { type: String, required: true },
  description: { type: String, default: '' }
})

InvoiceSchema.statics.insert = function (doc) {
  const newInvoice = new this(doc)
  return newInvoice.save()
}

InvoiceSchema.statics.all = function (user) {
  return this.find({ user: user })
}

InvoiceSchema.statics.update = function (user, id, doc) {
  return this.findOne({ user: user, _id: id })
    .then(invoice => {
      // TODO is the the cleanest solution to update entire doc?
      Object.assign(invoice, doc)
      return invoice.save()
    })
}

InvoiceSchema.statics.get = function (user, id) {
  return this.findOne({ user: user, _id: id })
}

InvoiceSchema.statics.delete = function (user, id) {
  return this.findOne({ user: user, _id: id })
    .then(doc => {
      if (!doc) throw new Error('no doc found')
      const isOwner = isEqual(user, doc.user)
      if (!isOwner) throw new Error('not owner')
      return this.remove({ _id: doc._id })
    })
}

const Invoice = mongoose.model('Invoice', InvoiceSchema)

module.exports = Invoice
