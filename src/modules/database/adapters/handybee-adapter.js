const DatabaseAdapter = require('./database-adapter')

module.exports = class HandyBeeAdapter extends DatabaseAdapter {
  constructor ({ storage, eventService, replicationManager }) {
    super()
    this.storage = storage
    this.eventService = eventService
    this.replicationManager = replicationManager
  }

  getActiveDatabase (opts = {}) {
    const { model } = opts
    const user = this.storage.get('user')
    return model ? user.database : user.db
  }

  getActiveMasterDatabase () {
    return this.getActiveDatabase()
  }

  _parseQuery (query) {
    const { model, where } = query
    const result = []
    result.push(model)
    Object.keys(where).forEach(key => {
      result.push(key)
      result.push(where[key])
    })
    return result.join(':')
  }

  _parseStore (query) {
    const { model, attributes } = query
    const { id, updatedAt, createdAt, updatedAtHr, createdAtHr } = attributes
    return {
      key: `${model}:id:${id}`,
      keys: [
        `${model}:id:${id}`,
        `${model}:updatedAt:${updatedAt}`,
        `${model}:createdAt:${createdAt}`,
        // Hight resolution
        `${model}:updatedAtHr:${updatedAtHr}`,
        `${model}:createdAtHr:${createdAtHr}`
      ],
      value: attributes
    }
  }

  async query (query) {
    const key = this._parseQuery(query)

    return await this.get(key)
  }

  async store (query) {
    const { keys, value } = this._parseStore(query)
    for await (const key of keys) {
      await this.put(key, value)
    }
  }

  async create (query) {
    return await this.store(query)
  }

  async update (query) {
    const { keys, value } = this._parseStore(query)
    for await (const key of keys) {
      await this.put(key, value)
    }
  }

  async destroy (query) {
    const { keys } = this._parseStore(query)
    for await (const key of keys) {
      await this.del(key)
    }
  }

  async put (key, value) {
    const db = this.getActiveDatabase()

    await db.put(key, JSON.stringify(value))
  }

  async getWildcard (key) {
    const db = this.getActiveDatabase()

    const gte = key.slice(0, key.length - 1)
    const stream = db.createReadStream({
      gte: Buffer.from(gte),
      lte: Buffer.from(gte + '{') // Use a character that comes after all expected characters in the key
    })

    const items = []
    for await (const item of stream) {
      items.push(JSON.parse(item.value))
    }

    return items
  }

  async get (key) {
    // is there a wild card?
    if (key.includes('*')) {
      return await this.getWildcard(key)
    }

    const db = this.getActiveDatabase()
    const value = (await db.getValue(key))
    if (!value) return null
    try {
      return JSON.parse(value.toString())
    } catch (error) {
      return value.toString()
    }
  }

  async del (key) {
    const db = this.getActiveDatabase()
    await db.del(key)
  }

  async getResources ({ resource }) {
    return (await this.getActiveMasterDatabase().getResources({ resource }))
  }

  async findResourceByResourceKey (key) {
    return await this.getActiveMasterDatabase().findResourceByResourceKey(key)
  }

  replicationSupported () {
    return this.replicationManager.replicationSupported()
  }

  isReplicated () {
    return this.replicationManager.isReplicated({
      databaseModel: this.getActiveDatabase({ model: true })
    })
  }

  replicationInProgress () {
    return this.replicationManager.replicationInProgress({
      databaseModel: this.getActiveDatabase({ model: true })
    })
  }

  startReplication (opts = {}) {
    const { swarmKey } = opts
    this.replicationManager.start({
      swarmKey, // Pre-defined hyperswarm
      databaseModel: this.getActiveDatabase({ model: true })
    })
  }
}
