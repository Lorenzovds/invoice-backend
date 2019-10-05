'use strict'

const router = require('express').Router()
const httpError = require('http-errors')
const Invoices = require('../db/model/invoice')

router.get('/', (req, res, next) => {
  const { user } = req

  Invoices.all(user)
    .then(invoices => {
      res.status(200).send(invoices)
    })
    .catch(next)
})

router.post('/', (req, res, next) => {
  const { body, user } = req
  Object.assign(body, { user })
  Invoices.insert(body)
    .then(() => {
      res.send(body).status(200)
    })
    .catch(next)
})

router.get('/:id', (req, res, next) => {
  const { params, user } = req
  const { id } = params
  Invoices.get(user, id)
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
  Invoices.update(user, id, body)
    .then(() => {
      res.send(body).status(200)
    })
    .catch(next)
})

router.delete('/:id', (req, res, next) => {
  const { user, params } = req
  const { id } = params
  Invoices.delete(user, id)
    .then(() => {
      res.send().status(200)
    })
    .catch(next)
})

module.exports = router
