const { createUser } = require('p2p-auth')

module.exports = class UserService {
  constructor ({ userRepository, userFactory }) {
    this.repository = userRepository
    this.userFactory = userFactory
  }

  async create ({ username, password }) {
    try {
      const { mnemonic } = await createUser({ username, password })

      return { mnemonic }
    } catch (error) {
      throw new Error(`User creation failed for: ${username}. Message: ${error.message}`)
    }
  }

  async initializeSession ({ username, keyPair }) {
    const { db, masterDb } = await this.repository.initializeUserDatabases({ keyPair })
    const user = this.make({ username, keyPair, db, masterDb })
    this.setUser(user)
    return user
  }

  make ({ username, keyPair, db, masterDb }) {
    return this.userFactory.create({ username, keyPair, db, masterDb })
  }

  getUser () {
    return this.repository.getUser()
  }

  setUser (user) {
    this.repository.setUser(user)
  }
}
