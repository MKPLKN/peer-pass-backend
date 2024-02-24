module.exports = class UserFacade {
  constructor ({ userController }) {
    this.controller = userController
  }

  async get () {
    return await this.controller.get()
  }

  async create (payload) {
    return await this.controller.create(payload)
  }
}
