const RPCFactory = require('../rpc-factory')

class FakeSocket {
  constructor () {
    this.publicKey = 'fake-pubkey'
    this.remotePublicKey = 'fake-remote-pubkey'
    this.events = new Map()
    this._publicKey = null
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

class FakeRPC {
  constructor (opts) {
    this.opts = opts
  }

  connect () {
    console.log('Connect...')
  }

  createServer () {
    console.log('Create server...')
    return {
      listen: () => {
        console.log('Listen...')
      }
    }
  }
}

class FakeRPCFactory extends RPCFactory {
  initializeRPC (opts) {
    return new FakeRPC(opts)
  }
}

module.exports = { FakeRPCFactory, FakeSocket }
