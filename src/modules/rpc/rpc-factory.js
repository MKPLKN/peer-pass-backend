// const uuid = require('uuid')
const RPC = require('./rpc-model')
const HyperswarmRPC = require('@hyperswarm/rpc')

module.exports = class RPCFactory {
  init (attributes, opts) {
    const rpc = this.make(attributes)
    rpc.rpc = this.initializeRPC(opts)
    return rpc
  }

  make (attributes) {
    return (new RPC()).make(attributes)
  }

  initializeRPC (opts) {
    return new HyperswarmRPC(opts)
  }
}
