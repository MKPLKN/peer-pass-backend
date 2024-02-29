module.exports = class DatabaseRegistry {
  constructor ({ storage }) {
    this.storage = storage
  }

  getServiceKey (key) {
    return `database.services.${key}`
  }

  getInstanceKey (key) {
    return `database.instances.${key}`
  }

  addService (key, value) {
    this.add(this.getServiceKey(key), value)
  }

  getService (key) {
    return this.get(this.getServiceKey(key))
  }

  addInstance (key, value) {
    this.add(this.getInstanceKey(key), value)
  }

  getInstance (key) {
    return this.get(this.getInstanceKey(key))
  }

  add (key, value) {
    if (this.storage.has(key)) {
      this.storage.delete(key)
    }

    this.storage.set(key, value)
  }

  get (key) {
    return this.storage.get(key)
  }
}
