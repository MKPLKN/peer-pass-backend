const uuid = require('uuid')
const goodbye = require('graceful-goodbye')
const { makeSwarm } = require('p2p-resources')
const Swarm = require('./swarm-model')

module.exports = class SwarmFactory {
  /**
   * Initializes the hyperDHT
   *
   * @param {*} opts
   * @returns HyperDHT
   */
  init (attributes, opts) {
    const swarm = this.make(attributes)
    swarm.hyperswarm = this.initializeSwarm(opts)
    return swarm
  }

  make (attributes) {
    return (new Swarm()).make(attributes)
  }

  initializeSwarm (opts) {
    const swarm = makeSwarm(opts)
    goodbye(() => swarm.destroy(), 1)
    return swarm
  }

  randomName () {
    return `created-by-peer-pass-${uuid.v4()}`
  }
}
