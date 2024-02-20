const uuid = require('uuid')
const { makeNode } = require('p2p-resources')
const DHT = require('./dht-model')

module.exports = class DHTFactory {
  /**
   * Initializes the hyperDHT
   *
   * @param {*} opts
   * @returns HyperDHT
   */
  init (attributes, opts) {
    const node = this.make(attributes)
    node.dht = this.initializeDHT(opts)
    return node
  }

  make (attributes) {
    return (new DHT()).make(attributes)
  }

  initializeDHT (opts) {
    return makeNode(opts)
  }

  randomName () {
    return `created-by-peer-pass-${uuid.v4()}`
  }
}
