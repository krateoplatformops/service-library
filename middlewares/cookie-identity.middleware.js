const logger = require('../helpers/logger.helpers')

const jwtHelpers = require('../helpers/jwt.helpers')
const envConstants = require('../constants/env.constants')

module.exports = (req, res, next) => {
  try {
    const cookieValue = req.cookies[envConstants.COOKIE_NAME]
    if (cookieValue) {
      const identity = jwtHelpers.verify(cookieValue)

      res.locals.identity = identity
      logger.debug('Identity from cookie')
    }
  } catch {
    // res.locals.identity = { id: 'unknown', username: 'unknown' }
  }

  next()
}
