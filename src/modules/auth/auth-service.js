const { restoreUser, authUser } = require('p2p-auth')

module.exports = class AuthService {
  constructor ({ userService, logger }) {
    this.userService = userService
    this.logger = logger
  }

  async restore ({ seedPhrase, username, password }) {
    try {
      return await restoreUser({ seedPhrase, username, password })
    } catch (error) {
      this.logger.error(`Restore failed for user ${username}: ${error.message}`, { username })
      throw new Error(`User restore failed for ${username}`)
    }
  }

  async authenticate ({ username, password }) {
    try {
      const { keyPair } = await authUser({ username, password })
      const user = await this.userService.initializeSession({ username, keyPair })
      return { user }
    } catch (error) {
      this.logger.error(`Authentication failed for user ${username}: ${error.message}`, { username })
      throw new Error(`Authentication failed for ${username}`)
    }
  }
}
