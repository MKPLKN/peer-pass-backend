module.exports = class DatabaseService {
  constructor ({ eventService, databaseAdapter }) {
    this.eventService = eventService
    this.adapter = databaseAdapter
  }

  getActiveDatabase (opts = {}) {
    return this.adapter.getActiveDatabase(opts)
  }

  getActiveMasterDatabase () {
    return this.adapter.getActiveMasterDatabase()
  }

  async getInfo () {
    return this.adapter.getInfo()
  }

  async teardown () {
    return this.adapter.teardown()
  }

  async query (query) {
    return this.adapter.query(query)
  }

  async store (obj) {
    return this.adapter.store(obj)
  }

  async update (obj) {
    return this.adapter.update(obj)
  }

  async destroy (obj) {
    return this.adapter.destroy(obj)
  }

  async put (key, value) {
    await this.adapter.put(key, value)
  }

  async get (key) {
    return await this.adapter.get(key)
  }

  async getResources ({ resource }) {
    return this.adapter.getResources({ resource })
  }

  async findResourceByResourceKey (key, opts = {}) {
    return await this.adapter.findResourceByResourceKey(key, opts)
  }

  async findResourceByName (key) {
    return await this.adapter.findResourceByName(key)
  }

  replicationSupported () {
    return this.adapter.replicationSupported()
  }

  isReplicated () {
    return this.adapter.isReplicated()
  }

  replicationInProgress () {
    return this.adapter.replicationInProgress()
  }

  startReplication (opts = {}) {
    this.adapter.startReplication(opts)
  }
}
