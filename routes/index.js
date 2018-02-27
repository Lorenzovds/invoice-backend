const express = require('express')
const _ = require('lodash')

const router = express.Router()
const pkg = require('../package.json')

router.get('/', function (req, res, next) {
  const cleanedPkg = _.pick(pkg, ['version', 'name'])
  res.send(cleanedPkg)
})

module.exports = router
