const { createCore, makeDatabase } = require('p2p-resources')
const DatabaseFactory = require('./database-factory')
const HandyBee = require('../models/handybee-model')
const { getKeyChain } = require('p2p-auth')
const { makePrivateCore } = require('p2p-resources/src/utils/cores')
const { getDefaultStoragePath } = require('p2p-resources/src/utils/cores')
const { keyPair: getKeyPair } = require('hypercore-crypto')

module.exports = class HandyBeeFactory extends DatabaseFactory {
  async create (attributes) {
    const { keyPair } = attributes

    const keyChain = getKeyChain(keyPair)

    // Unique name for the application's database
    const signature = keyChain.get().sign(Buffer.from('@peer-pass'))
    const dbKeyPair = keyChain.get(signature)

    const pubkey = keyPair.publicKey.toString('hex')
    const prefix = getDefaultStoragePath(pubkey) // By default the path is: ~/.p2p-resources/<pubkey>
    const core = await makePrivateCore(`${prefix}/@peer-pass`, getKeyPair(dbKeyPair.scalar), { encryptionKey: signature })
    const db = await makeDatabase(core)

    return {
      db: new HandyBee({ db })
    }
  }

  async createDatabase ({ db, name }) {
    const { core } = await createCore(db, { name, encrypted: true })
    return await makeDatabase(core)
  }
}
