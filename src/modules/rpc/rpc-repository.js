module.exports = class RPCRepository {
  constructor ({ storage }) {
    this.storage = storage
  }

  setStorage (key, value) {
    this.storage.set(key, value)
  }

  getStorage (key) {
    return this.storage.get(key)
  }

  getAll () {
    return this.storage.get('rpc.initialized')
  }
}
