const { usernameExists } = require('p2p-auth')

async function validateUserCreationPayload (payload) {
  const { username, password, confirmPassword } = payload

  // 1) Password should match
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match')
  }

  // 2) Username should not exist
  if (await usernameExists(username)) {
    throw new Error('Username already exists')
  }

  return payload
}

module.exports = class UserController {
  constructor ({ eventService, userService, logger }) {
    this.eventService = eventService
    this.userService = userService
    this.logger = logger
  }

  async get () {
    try {
      const user = this.userService.getUser()

      if (!user) return { success: false, isAuthenticated: false }

      return {
        success: true,
        isAuthenticated: user.isAuthenticated,
        username: user.username
      }
    } catch (error) {
      this.logger.error(`User get failed: ${error.message}`, { error })
      return { success: false, isAuthenticated: false }
    }
  }

  async create (event, payload) {
    try {
      if (!payload) payload = event
      await validateUserCreationPayload(payload)
      const { mnemonic } = await this.userService.create(payload)
      this.eventService.emit('user:created')
      return { success: true, seed: mnemonic }
    } catch (error) {
      this.logger.error(`User create failed: ${error.message}`, { username: payload.username })
      return { success: false, error }
    }
  }
}
