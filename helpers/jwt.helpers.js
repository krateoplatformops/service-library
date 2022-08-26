const jwt = require('jsonwebtoken')
const { envConstants, cookieConstants } = require('./../constants')

const sign = (obj) => {
  delete obj.expiresIn
  delete obj.iat
  delete obj.exp
  delete obj.iss

  return jwt.sign(obj, envConstants.JWT_SECRET, {
    issuer: envConstants.JWT_ISSUER,
    expiresIn: cookieConstants.maxAge
  })
}

const verify = (token) => {
  return jwt.verify(token, envConstants.JWT_SECRET)
}

module.exports = {
  sign,
  verify
}
