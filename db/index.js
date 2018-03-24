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
    const date = Date.now()
    Object.assign(doc, { date })
    store.insert(doc, (err, newDocs) => {
      err ? reject(err) : resolve(newDocs)
    })
  })
}

function getAll (name, user) {
  return new Promise((resolve, reject) => {
    const store = storeMap[name]
    if (!store) return reject(new Error('no such store'))
    store.find({ user: user }, (err, docs) => {
      err ? reject(err) : resolve(docs)
    })
  })
}

function update (name, user, id, doc) {
  return new Promise((resolve, reject) => {
    const store = storeMap[name]
    if (!store || !doc) return reject(new Error('no such store or empty doc'))
    const date = Date.now()
    Object.assign(doc, { date })
    store.update({ user: user, _id: id }, doc, {}, (err, newDocs) => {
      err ? reject(err) : resolve(newDocs)
    })
  })
}

function get (name, user, id) {
  return new Promise((resolve, reject) => {
    const store = storeMap[name]
    if (!store) return reject(new Error('no such store'))
    store.findOne({ user: user, _id: id }, (err, doc) => {
      err ? reject(err) : resolve(doc)
    })
  })
}

function remove (name, user, id) {
  return new Promise((resolve, reject) => {
    const store = storeMap[name]
    if (!store) return reject(new Error('no such store'))
    store.findOne({ user: user, _id: id }, (err, doc) => {
      if (err) return reject(err)
      if (!doc) return reject(new Error('no such invoice'))
      const isOwner = _.isEqual(user, doc.user)
      if (!isOwner) reject(new Error('not owner'))
      store.remove({_id: doc._id})
      resolve()
    })
  })
}

module.exports = {
  init,
  get,
  insert,
  all: getAll,
  delete: remove,
  update
}
