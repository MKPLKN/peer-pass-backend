const { getKeyChain, generateKeyPairFromSeed } = require('p2p-auth')
const { createNode } = require('p2p-resources')

module.exports = class DHTRepository {
  constructor ({ storage, databaseService }) {
    this.storage = storage
    this.databaseService = databaseService
  }

  get defaultKey () {
    return 'peer-pass:default-dht'
  }

  setDht (key, value) {
    this.storage.set(key, value)
  }

  getDht (key) {
    return this.storage.get(key)
  }

  async getAll () {
    const list = (await this.databaseService.getResources({ resource: 'hyperdht' })).map(node => ({ ...node.details }))

    return list
  }

  async getDefaultNode () {
    const defaultNodeKey = await this.getDefaultDhtKey()
    if (!defaultNodeKey) return null
    return await this.databaseService.findResourceByResourceKey(defaultNodeKey)
  }

  async create (attributes) {
    const { name, bootstrap, setAsDefault } = attributes

    const db = this.databaseService.getActiveMasterDatabase()
    const getKeyPair = (name) => {
      const seed = getKeyChain(db.core.keyPair).get(name).scalar
      return { seed: seed.toString('hex'), keyPair: generateKeyPairFromSeed(seed) }
    }
    const { details } = await createNode(db, { name, getKeyPair, bootstrap: bootstrap || null })
    if (details && details.resourceKey && setAsDefault) {
      await this.setDefaultDhtKey(details.resourceKey)
    }

    return { details }
  }

  async findByResourceKey (key, opts = {}) {
    return await this.databaseService.findResourceByResourceKey(key, opts)
  }

  async findResourceByName (name) {
    return await this.databaseService.findResourceByName(name)
  }

  async setDefaultDhtKey (key) {
    await this.databaseService.put(this.defaultKey, key)
  }

  async getDefaultDhtKey () {
    return await this.databaseService.get(this.defaultKey)
  }
}
