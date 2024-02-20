const SwarmFactory = require('../swarm-factory')

class FakeSocket {
  constructor () {
    this.remotePublicKey = Buffer.allocUnsafe(32).fill('fake-remote-pubkey')
    this.events = new Map()
  }

  on (eventName, fn) {
    const listeners = this.events.get(eventName) || []
    listeners.push(fn)
    this.events.set(eventName, listeners)
  }

  emit (eventName, payload) {
    const listeners = this.events.get(eventName)
    if (listeners && listeners.length) {
      for (const cb of listeners) {
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

class FakeDiscovery {
  flushed () {
    //
  }
}

class FakeSwarm extends FakeSocket {
  constructor (opts) {
    super()
    this.opts = opts
  }

  join () {
    return new FakeDiscovery()
  }
}

class FakeSwarmFactory extends SwarmFactory {
  initializeSwarm (opts) {
    return new FakeSwarm(opts)
  }
}

module.exports = { FakeSwarmFactory, FakeSwarm, FakeDiscovery, FakeSocket }
