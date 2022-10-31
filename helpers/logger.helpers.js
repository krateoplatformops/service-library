const winston = require('winston')
const { format } = winston

const envConstants = require('../constants/env.constants')

const logFormat = format.printf(
  (info) => `${info.timestamp} ${info.level}: ${info.message}`
)

class Logger {
  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: envConstants.LOG_LEVEL,
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.simple(),
            winston.format.errors({ stack: true }),
            logFormat
          )
        })
      ]
    })
  }

  parseObj(a) {
    try {
      return Object.prototype.toString.call(a) === '[object String]'
        ? a
        : JSON.stringify(a)
    } catch {
      return '[Object]'
    }
  }

  // Levels
  silly(obj) {
    this.logger.silly(this.parseObj(obj))
  }

  debug(obj) {
    this.logger.debug(this.parseObj(obj))
  }

  verbose(obj) {
    this.logger.verbose(this.parseObj(obj))
  }

  info(obj) {
    this.logger.info(this.parseObj(obj))
  }

  warn(obj) {
    this.logger.warn(this.parseObj(obj))
  }

  error(obj) {
    this.logger.error(this.parseObj(obj))
  }
}

module.exports = new Logger()
