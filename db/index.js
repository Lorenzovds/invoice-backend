'use strict'

const _ = require('lodash')
const Invoices = require('./model/invoice')

function insert (name, doc) {
  const newInvoice = Invoices(doc)
  return newInvoice.save()
}

function getAll (name, user) {
  return Invoices.find({ user: user })
}

function update (name, user, id, doc) {
  return Invoices.findOne({ user: user, _id: id })
    .then(invoice => {
      // TODO is the the cleanest solution to update entire doc?
      Object.assign(invoice, doc)
      return invoice.save()
    })
}

function get (name, user, id) {
  return Invoices.findOne({ user: user, _id: id })
}

function remove (name, user, id) {
  return Invoices.findOne({ user: user, _id: id })
    .then(doc => {
      if (!doc) throw new Error('no doc found')
      const isOwner = _.isEqual(user, doc.user)
      if (!isOwner) throw new Error('not owner')
      return Invoices.remove({ _id: doc._id })
    })
}

module.exports = {
  get,
  insert,
  all: getAll,
  delete: remove,
  update
}
