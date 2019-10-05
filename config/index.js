const fs = require('fs')
const path = require('path')

let config
// use hardcoded values for local development
if (fs.existsSync(path.resolve(`${__dirname}/config.js`))) {
  config = require(path.resolve(`${__dirname}/config`))
} else {
  config = process.env
}

const users = require('./users.js')

module.exports = {
  config,
  users
}
