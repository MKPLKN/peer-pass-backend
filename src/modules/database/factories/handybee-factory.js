const { createCore, makeDatabase } = require('p2p-resources')
const DatabaseFactory = require('./database-factory')
const HandyBee = require('../models/handybee-model')
const { getKeyChain } = require('p2p-auth')
const { makePrivateCore } = require('p2p-resources/src/utils/cores')
const { getDefaultStoragePath } = require('p2p-resources/src/utils/cores')
const { keyPair: getKeyPair } = require('hypercore-crypto')

module.exports = class HandyBeeFactory extends DatabaseFactory {
  async create (attributes) {
    const { name, keyPair, encrypted = true } = attributes

    const keyChain = getKeyChain(keyPair)

    // Unique name for the application's database
    const signature = keyChain.get().sign(Buffer.from(name))
    const dbKeyPair = keyChain.get(signature)

    const pubkey = keyPair.publicKey.toString('hex')
    const prefix = getDefaultStoragePath(pubkey) // By default the path is: ~/.p2p-resources/<pubkey>

    const core = await makePrivateCore(`${prefix}/@peer-pass`, getKeyPair(dbKeyPair.scalar), {
      encryptionKey: encrypted ? signature : null
    })
    const db = await makeDatabase(core)

    return new HandyBee({ name, db })
  }

  async createDatabase ({ db, name }) {
    const { core } = await createCore(db, { name, encrypted: true })
    return await makeDatabase(core)
  }
}
