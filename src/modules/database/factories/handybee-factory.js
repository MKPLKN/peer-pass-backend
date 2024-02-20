const { initMasterComponents, createCore, makeDatabase } = require('p2p-resources')
const DatabaseFactory = require('./database-factory')
const HandyBee = require('../models/handybee-model')

module.exports = class HandyBeeFactory extends DatabaseFactory {
  async create (attributes) {
    const { keyPair } = attributes
    const { masterDb: db } = await initMasterComponents({ keyPair })

    let peerPassDb = await db.findResourceByName('peer-pass')
    if (!peerPassDb) {
      peerPassDb = await this.createDatabase({ db, name: 'peer-pass' })
    } else {
      peerPassDb = await makeDatabase(peerPassDb.hypercore)
    }

    // We also need access to the master db
    // p2p-resources ^0.0.12 store DHT nodes/swarms into the master db
    return {
      db: new HandyBee({
        db: peerPassDb
      }),
      masterDb: db
    }
  }

  async createDatabase ({ db, name }) {
    const { core } = await createCore(db, { name, encrypted: true })
    return await makeDatabase(core)
  }
}
