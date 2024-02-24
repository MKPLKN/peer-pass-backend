module.exports = class AuthFacade {
  constructor ({ authController }) {
    this.controller = authController
  }

  async login (payload) {
    return await this.controller.login(payload)
  }

  async create (payload) {
    return await this.controller.login(payload)
  }
}
