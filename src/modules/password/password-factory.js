const Password = require('./password-model')

const uuid = require('uuid')

module.exports = class PasswordFactory {
  make (attributes) {
    return (new Password()).make(attributes)
  }

  create (attributes) {
    const now = new Date().getTime()
    const nowHr = process.hrtime.bigint().toString()
    attributes.id = uuid.v4()
    attributes.updatedAt = now
    attributes.createdAt = now
    // High resolution
    attributes.updatedAtHr = nowHr
    attributes.createdAtHr = nowHr
    // Default
    if (!attributes.websites) {
      attributes.websites = []
    }
    return (new Password()).make(attributes)
  }
}
