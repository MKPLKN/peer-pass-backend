const validate = require('./validation')

module.exports = class PasswordController {
  constructor ({ eventService, passwordService, logger }) {
    this.eventService = eventService
    this.passwordService = passwordService
    this.logger = logger
  }

  async index (event, payload) {
    try {
      if (!payload) payload = event

      const key = payload ? payload.key : 'id'
      const passwords = await this.passwordService.index(key)

      return { success: true, items: passwords }
    } catch (error) {
      this.logger.error(`Password index failed: ${error.message}`, { error })
      return { success: false, error }
    }
  }

  async create (event, payload) {
    try {
      if (!payload) payload = event

      const password = await this.passwordService.create(
        validate(payload)
      )

      return { success: true, password: password.getAttributes() }
    } catch (error) {
      this.logger.error(`Password create failed: ${error.message}`, { error })
      return { success: false, error }
    }
  }

  async update (event, payload) {
    try {
      if (!payload) payload = event

      const password = await this.passwordService.update(
        validate(payload, { method: 'update' })
      )

      return { success: true, password: password.getAttributes() }
    } catch (error) {
      this.logger.error(`Password update failed: ${error.message}`, { error })
      return { success: false, error }
    }
  }

  async destroy (event, payload) {
    try {
      if (!payload) payload = event
      const { id } = validate(payload, { method: 'destroy' })

      await this.passwordService.destroy(id)

      return { success: true, password: null }
    } catch (error) {
      this.logger.error(`Password destroy failed: ${error.message}`, { error })
      return { success: false, error }
    }
  }
}
