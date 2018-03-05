'use strict'

const router = require('express').Router()
const httpError = require('http-errors')
const db = require('../db')

router.get('/', (req, res, next) => {
  const test = [{
    name: 'foo'
  },
  {
    name: 'bar'
  }]
  res.send(test)
})

router.post('/', (req, res, next) => {
  const { body, user } = req
  Object.assign(body, { user })
  db.insert('invoices', body)
    .then(() => {
      res.send(body).status(200)
    })
    .catch(err => next(httpError(400, err)))
})

module.exports = router
