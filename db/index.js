'use strict'
const Datastore = require('nedb')
const _ = require('lodash')
const path = require('path')
const STORES_TO_CREATE = ['invoices']
const storeMap = {}

function init () {
  return new Promise((resolve, reject) => {
    try {
      _.forEach(STORES_TO_CREATE, name => {
        const invoiceStore = new Datastore({ filename: path.resolve(__dirname, 'invoices.db'), autoload: true })
        storeMap[name] = invoiceStore
      })
      return resolve()
    } catch (err) {
      return reject(err)
    }
  })
}

function insert (name, doc) {
  return new Promise((resolve, reject) => {
    const store = storeMap[name]
    if (!store || !doc) return reject(new Error('no such store or empty doc'))
    store.insert(doc, (err, newDocs) => {
      err ? reject(err) : resolve(newDocs)
    })
  })
}

function get (name) {
  return storeMap[name]
}

module.exports = {
  init,
  get,
  insert
}
