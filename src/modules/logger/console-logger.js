const ILogger = require('./logger')

module.exports = class ConsoleLogger extends ILogger {
  constructor () {
    super()
    this.cache = new Map()
  }

  info (msg, trace) {
    console.info(msg, trace || '')
  }

  error (msg, trace) {
    console.error(msg, trace || '')
  }
}
