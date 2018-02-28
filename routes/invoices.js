'use strict'

const router = require('express').Router()

router.get('/', (req, res, next) => {
  const test = [{
    name: 'foo'
  },
  {
    name: 'bar'
  }]
  res.send(test)
})

module.exports = router
