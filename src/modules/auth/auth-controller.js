function validateRestorePayload (payload) {
  const { username, password, confirmPassword, seed: seedPhrase } = payload
  if (!username || !password || !seedPhrase) {
    throw new Error('Missing required fields')
  }
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match')
  }

  return { username, password, seedPhrase }
}

module.exports = class AuthController {
  constructor ({ eventService, authService, logger }) {
    this.eventService = eventService
    this.authService = authService
    this.logger = logger
  }

  async login (event, payload) {
    try {
      if (!payload) payload = event
      const { username: name, password } = payload
      const { user } = await this.authService.authenticate({ username: name, password })

      this.eventService.emit('user:authenticated', { user })

      return { success: true }
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`, { username: payload.username })
      return { success: false, error: 'Authentication failed' }
    }
  }

  async restore (event, payload) {
    try {
      if (!payload) payload = event
      const { username, password, seedPhrase } = validateRestorePayload(payload)
      await this.authService.restore({ seedPhrase, username, password })

      return { success: true }
    } catch (error) {
      this.logger.error(`Restore failed: ${error.message}`, { username: payload.username })
      return { success: false, error: 'Restore failed' }
    }
  }
}
