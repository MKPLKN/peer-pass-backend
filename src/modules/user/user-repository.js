module.exports = class UserRepository {
  constructor ({ storage }) {
    this.storage = storage
  }

  getUser () {
    return this.storage.get('user')
  }

  setUser (user) {
    return this.storage.set('user', user)
  }
}
