'use strict'

const router = require('express').Router()
const _ = require('lodash')

const pkg = require('../package.json')
const invoiceRouter = require('./invoices')

router.get('/', function (req, res, next) {
  const cleanedPkg = _.pick(pkg, ['version', 'name'])
  res.send(cleanedPkg)
})

router.use('/invoices', invoiceRouter)

module.exports = router
