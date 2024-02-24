module.exports = class User {
  constructor ({ username, keyPair, db }) {
    this.username = username
    this.keyPair = keyPair
    this.database = db
  }

  get isAuthenticated () {
    return !!this.pubkey
  }

  get name () {
    return this.username
  }

  get pubkey () {
    return this.keyPair && this.keyPair.publicKey ? this.keyPair.publicKey.toString('hex') : null
  }

  get db () {
    return this.database.db
  }
}
