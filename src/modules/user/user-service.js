const { createUser } = require('p2p-auth')

module.exports = class UserService {
  constructor ({ userRepository, userFactory, createUserServices }) {
    this.repository = userRepository
    this.userFactory = userFactory
    this.createServices = createUserServices
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
    await this.createServices({ keyPair })
    const user = this.make({ username, keyPair })
    this.setUser(user)
    return user
  }

  make ({ username, keyPair, db }) {
    return this.userFactory.create({ username, keyPair, db })
  }

  getUser () {
    return this.repository.getUser()
  }

  setUser (user) {
    this.repository.setUser(user)
  }
}
