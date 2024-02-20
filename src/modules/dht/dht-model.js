module.exports = class DHT {
  constructor () {
    this.attributes = null
    this.socket = null
  }

  get key () {
    return this.attributes ? this.getAttributes('key') : null
  }

  make (attributes) {
    this.attributes = attributes
    return this
  }

  disconnected () {
    this.setAttribute('connected', false)
  }

  connected () {
    this.setAttribute('connected', true)
  }

  setSocket (socket) {
    this.socket = socket
  }

  setAttribute (key, value) {
    this.attributes[key] = value
  }

  getAttributes (key) {
    const attributes = this.attributes

    return key ? attributes[key] : attributes
  }
}
