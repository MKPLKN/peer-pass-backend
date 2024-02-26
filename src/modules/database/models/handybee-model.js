const b4a = require('b4a')
const Database = require('./database-model')

module.exports = class HandyBee extends Database {
  constructor ({ db }) {
    super({ db })
  }

  get topic () {
    return typeof this.discoveryKey === 'string' ? b4a.from(this.discoveryKey, 'hex') : this.discoveryKey
  }

  get discoveryKey () {
    return this.db.discoveryKey
  }

  get key () {
    return this.db.key.toString('hex')
  }

  getInfo () {
    return {
      key: this.key,
      discoveryKey: this.discoveryKey.toString('hex')
    }
  }

  getReplicationState () {
    return {
      replicated: this.replicated,
      replication_status: this.replication_status,
      replication_started_at: this.replication_started_at,
      replication_stopped_at: this.replication_stopped_at
    }
  }
}
