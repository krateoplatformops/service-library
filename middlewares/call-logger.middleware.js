const { logger } = require('../helpers/logger.helpers')
const { pathConstants } = require('../constants')

module.exports = (req, res, next) => {
  let skip = false
  pathConstants.noLoggingPath.forEach((r) => {
    const base = `/${req.originalUrl.split('/')[1]}/*`
    if (r === req.originalUrl || r === base) {
      skip = true
    }
  })

  if (!skip) {
    logger.info(`${req.path} - ${req.method} - ${req.ip}`)
    if (Object.keys(req.body).length > 0) {
      logger.debug(req.body)
    }
    if (Object.keys(req.params).length > 0) {
      logger.debug(req.params)
    }
    if (Object.keys(req.query).length > 0) {
      logger.debug(req.query)
    }
  }

  next()
}
