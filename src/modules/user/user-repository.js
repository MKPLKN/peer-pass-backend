module.exports = class UserRepository {
  constructor ({ storage, databaseService }) {
    this.storage = storage
    this.databaseService = databaseService
  }

  async initializeUserDatabases ({ keyPair }) {
    const { db } = await this.databaseService.create({ keyPair })
    return { db }
  }

  getUser () {
    return this.storage.get('user')
  }

  setUser (user) {
    return this.storage.set('user', user)
  }
}
