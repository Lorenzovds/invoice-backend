'use strict'

const router = require('express').Router()
const _ = require('lodash')

const invoiceRouter = require('./invoices')
const userRouter = require('./users')
const { verify } = require('../lib/oktaClient')
const logger = require('../lib/logger')
const httpError = require('http-errors')

router.use('/invoices', verifyRequest, invoiceRouter)
router.use('/users', verifyRequest, userRouter)

function verifyRequest (req, res, next) {
  const accessToken = req.get('accessToken')
  verify(accessToken)
    .then(claim => {
      // add user object to the request for future use
      req.user = _.pick(claim.claims, ['uid', 'sub'])
      next()
    })
    .catch(err => {
      logger.error(err)
      next(httpError(401))
    })
}

module.exports = router
