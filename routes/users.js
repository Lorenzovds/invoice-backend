const express = require('express')
const router = express.Router()
const httpError = require('http-errors')
const { users } = require('../config')

const oktaClient = require('../lib/oktaClient').client

/**
 * Create a new user
 */
router.post('/', (req, res, next) => {
  if (!req.body) return next(httpError(400))
  const { firstName, lastName, email, password } = req.body
  const newUser = {
    profile: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      login: email
    },
    credentials: {
      password: {
        value: password
      }
    }
  }
  oktaClient.createUser(newUser)
    .then(user => res.status(201).send(user))
    .catch(err => next(httpError(400, err)))
})

router.get('/me', (req, res, next) => {
  const { uid } = req.user
  const user = users[uid]

  if (!user) return res.status(400).send('user not configured')
  return res.status(200).send(user)
})

module.exports = router
