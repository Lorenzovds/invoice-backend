const okta = require('@okta/okta-sdk-nodejs')
const OktaJwtVerifier = require('@okta/jwt-verifier')

const config = require('../config')
const verifier = new OktaJwtVerifier({
  issuer: `${config.orgUrl}/oauth2/default`
})

const client = new okta.Client(config)

function verify (accessToken) {
  return verifier.verifyAccessToken(accessToken)
}

module.exports = {
  client,
  verify
}
