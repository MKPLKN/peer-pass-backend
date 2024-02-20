module.exports = class DatabaseAdapter {
  getActiveDatabase (opts) {
    throw new Error('getActiveDatabase is not implemented')
  }

  getActiveMasterDatabase () {
    throw new Error('getActiveMasterDatabase is not implemented')
  }

  async create (attributes) {
    throw new Error('create is not implemented')
  }

  async put (key, value) {
    throw new Error('put is not implemented')
  }

  async get (key) {
    throw new Error('get is not implemented')
  }

  replicationSupported () {
    throw new Error('replicationSupported is not implemented')
  }

  isReplicated () {
    throw new Error('isReplicated is not implemented')
  }

  replicationInProgress () {
    throw new Error('replicationInProgress is not implemented')
  }

  startReplication (otps = {}) {
    throw new Error('startReplication is not implemented')
  }
}
