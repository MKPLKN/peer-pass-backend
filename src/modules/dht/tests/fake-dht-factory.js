const DHTFactory = require('../dht-factory')

class FakeSocket {
  constructor () {
    this.remotePublicKey = 'fake-remote-pubkey'
    this.events = new Map()
  }

  on (eventName, fn) {
    const listeners = this.events.get(eventName) || []
    listeners.push(fn)
    this.events.set(eventName, listeners)
  }

  async emit (eventName, payload) {
    const listeners = this.events.get(eventName)
    if (listeners && listeners.length) {
      for await (const cb of listeners) {
        cb(payload)
      }
    }
  }

  write (data) {
    //
  }

  destroy () {
    //
  }
}

class FakeDHT {
  constructor (opts) {
    this.opts = opts
  }

  connect () {
    return new FakeSocket()
  }
}

class FakeDHTFactory extends DHTFactory {
  initializeDHT (opts) {
    return new FakeDHT(opts)
  }
}

module.exports = { FakeDHTFactory, FakeSocket }
