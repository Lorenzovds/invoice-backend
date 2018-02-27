'use strict'

const {
  NODE_ENV = 'development'
} = process.env

module.exports = require('pino')({
  level: NODE_ENV !== 'production' ? 'debug' : 'info',
  prettyPrint: NODE_ENV !== 'production'
})
