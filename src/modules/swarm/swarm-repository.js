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
    const { details } = await createSwarm(this.databaseService.getActiveMasterDatabase(), { name, dht })
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
