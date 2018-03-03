const okta = require('@okta/okta-sdk-nodejs')

const client = new okta.Client({
  orgUrl: 'https://dev-777161.oktapreview.com',
  token: '00LbZjiH9lLfN1GVDpg52p9TLLezieMA6oifNh6QQf'
})

module.exports = client
