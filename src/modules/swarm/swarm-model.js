module.exports = class Swarm {
  constructor () {
    this.attributes = null
    this.hyperswarm = null
  }

  get key () {
    return this.getAttributes('key')
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
}
