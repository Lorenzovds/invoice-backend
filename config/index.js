const fs = require('fs')
const path = require('path')

let credentials
// use hardcoded values for local development
if (fs.existsSync(path.resolve(`${__dirname}/config.js`))) {
  credentials = require(path.resolve(`${__dirname}/config`))
} else {
  credentials = process.env
}

const users = require('./users.js')

const { orgUrl, token, mongoDB } = credentials

module.exports = {
  orgUrl: orgUrl,
  token: token,
  mongoDB: mongoDB,
  users
}
