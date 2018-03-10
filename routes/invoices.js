'use strict'

const router = require('express').Router()
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

module.exports = router
