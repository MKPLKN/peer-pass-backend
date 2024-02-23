module.exports = class Password {
  constructor () {
    this.attributes = null

    this.fillable = new Set([
      'title',
      'identifier',
      'password',
      'websites',
      'note'
    ])
  }

  get id () {
    return this.getAttributes('id')
  }

  make (attributes) {
    this.attributes = attributes
    return this
  }

  setAttribute (key, value) {
    if (!this.attributes) this.attributes = {}
    this.attributes[key] = value
  }

  getAttributes (key) {
    const attributes = this.attributes

    return key ? attributes[key] : attributes
  }
}
