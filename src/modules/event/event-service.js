const { EventEmitter } = require('node:events')

module.exports = class EventService extends EventEmitter {
  constructor () {
    super()
    this.__placeholder__ = null
  }
}
