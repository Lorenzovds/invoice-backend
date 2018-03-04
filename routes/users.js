const express = require('express')
const router = express.Router()
const httpError = require('http-errors')

const oktaClient = require('../lib/oktaClient').client

/**
 * Create a new user
 */
router.post('/', (req, res, next) => {
  if (!req.body) return next(httpError(400))
  const newUser = {
    profile: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      login: req.body.email
    },
    credentials: {
      password: {
        value: req.body.password
      }
    }
  }
  oktaClient.createUser(newUser)
    .then(user => res.status(201).send(user))
    .catch(err => next(httpError(400, err)))
})

module.exports = router
