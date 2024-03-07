module.exports = class RPC {
  constructor () {
    this.attributes = null
    this.rpc = null // Hyperswarm RPC @hyperswarm/rpc
    this.server = null
    this.clients = new Map()
  }

  get key () {
    return this.attributes ? this.getAttributes('key') : null
  }

  make (attributes) {
    this.attributes = attributes
    return this
  }

  setAttribute (key, value) {
    this.attributes[key] = value
  }

  getAttributes (key) {
    const attributes = this.attributes

    return key ? attributes[key] : attributes
  }

  getInfo () {
    return {
      key: this.key,
      server: this.server ? this.server.publicKey.toString('hex') : null,
      clients: Array.from(this.clients.keys())
    }
  }

  addClient (key, client) {
    this.clients.set(key, client)
  }

  getClient (key) {
    return this.clients.get(key)
  }

  deleteClient (key) {
    this.clients.delete(key)
  }
}
