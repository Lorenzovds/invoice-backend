'use strict'

const router = require('express').Router()
const httpError = require('http-errors')
const db = require('../db')

router.get('/', (req, res, next) => {
  const { user } = req
  db.all('invoices', user)
    .then(invoices => {
      res.status(200).send(invoices)
    })
    .catch(next)
})

router.post('/', (req, res, next) => {
  const { body, user } = req
  Object.assign(body, { user })
  db.insert('invoices', body)
    .then(() => {
      res.send(body).status(200)
    })
    .catch(next)
})

router.get('/:id', (req, res, next) => {
  const { params, user } = req
  const { id } = params
  db.get('invoices', user, id)
    .then(invoice => {
      if (!invoice) return next(httpError(404))
      res.send(invoice).status(200)
    })
    .catch(next)
})

router.put('/:id', (req, res, next) => {
  const { body, user, params } = req
  const { id } = params
  Object.assign(body, { user })
  db.update('invoices', user, id, body)
    .then(() => {
      res.send(body).status(200)
    })
    .catch(next)
})

router.delete('/:id', (req, res, next) => {
  const { user, params } = req
  const { id } = params
  db.delete('invoices', user, id)
    .then(() => {
      res.send().status(200)
    })
    .catch(next)
})

module.exports = router
