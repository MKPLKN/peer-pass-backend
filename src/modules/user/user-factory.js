const User = require('./user-model')

module.exports = class UserFactory {
  create (attributes) {
    return new User(attributes)
  }
}
