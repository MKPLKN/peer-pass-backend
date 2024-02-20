const IStorage = require('./storage')

module.exports = class InMemoryStorage extends IStorage {
  constructor () {
    super()
    this.cache = new Map()
  }

  get (key) {
    const keys = key.split('.')
    let current = this.cache

    for (const part of keys) {
      if (current instanceof Map && current.has(part)) {
        current = current.get(part)
      } else {
        return undefined
      }
    }

    return current
  }

  set (key, value) {
    const keys = key.split('.')
    let current = this.cache

    keys.slice(0, -1).forEach((part, index) => {
      if (!current.has(part)) {
        current.set(part, new Map())
      } else if (!(current.get(part) instanceof Map)) {
        throw new Error(`Conflict at '${part}'`)
      }
      current = current.get(part)
    })

    current.set(keys[keys.length - 1], value)
  }

  delete (key) {
    const keys = key.split('.')
    let current = this.cache

    keys.slice(0, -1).forEach((part, index) => {
      if (current instanceof Map && current.has(part)) {
        current = current.get(part)
      } else {
        current = undefined
      }
    })

    if (current && current instanceof Map) {
      current.delete(keys[keys.length - 1])
    }
  }

  clear () {
    this.cache = new Map()
  }
}
