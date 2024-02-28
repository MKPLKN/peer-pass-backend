const { getKeyChain, generateKeyPairFromSeed } = require('p2p-auth')
const { createSwarm } = require('p2p-resources')

module.exports = class SwarmRepository {
  constructor ({ databaseService }) {
    this.databaseService = databaseService
  }

  get defaultKey () {
    return 'peer-pass:default-swarm'
  }

  async getAll () {
    const list = (await this.databaseService.getResources({ resource: 'hyperswarm' })).map(node => ({ ...node.details }))

    return list
  }

  async getDefaultSwarm () {
    const defaultSwarmKey = await this.getDefaultSwarmKey()
    if (!defaultSwarmKey) return null
    return await this.findByResourceKey(defaultSwarmKey)
  }

  async create (attributes) {
    const { name, dht } = attributes

    const db = this.databaseService.getActiveMasterDatabase()
    const getKeyPair = (name) => {
      const seed = getKeyChain(db.core.keyPair).get(name).scalar
      return { seed: seed.toString('hex'), keyPair: generateKeyPairFromSeed(seed) }
    }
    const { details } = await createSwarm(db, { name, getKeyPair, dht })

    return { details }
  }

  async findByResourceKey (key) {
    return await this.databaseService.findResourceByResourceKey(key)
  }

  async setDefaultSwarmKey (key) {
    await this.databaseService.put(this.defaultKey, key)
  }

  async getDefaultSwarmKey () {
    return await this.databaseService.get(this.defaultKey)
  }
}
