const okta = require('@okta/okta-sdk-nodejs')
const OktaJwtVerifier = require('@okta/jwt-verifier')

const { clientId, orgUrl, expectedAudience, token } = require('../config').config

const verifier = new OktaJwtVerifier({
  issuer: `${orgUrl}/oauth2/default`,
  clientId: clientId,
  assertClaims: {
    aud: expectedAudience
  }
})

const client = new okta.Client({
  orgUrl,
  token
})

function verify (accessToken) {
  return verifier.verifyAccessToken(accessToken, expectedAudience)
}

module.exports = {
  client,
  verify
}
