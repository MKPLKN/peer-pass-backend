const awilix = require('awilix')
const ConsoleLogger = require('./console-logger')
const WinstonLogger = require('./winston-logger')

function registerLoggerModule (container, options = {}) {
  const { logger } = options

  let Logger = null
  switch (logger) {
    case 'console':
      Logger = ConsoleLogger
      break
    case 'winston':
      Logger = WinstonLogger
      break
    default:
      Logger = ConsoleLogger
      break
  }

  container.register({
    logger: awilix.asClass(Logger).singleton()
  })
}

module.exports = { registerLoggerModule }
