module.exports = class PasswordFacade {
  constructor ({ passwordController }) {
    this.controller = passwordController
  }

  async find (id) {
    return await this.controller.find(id)
  }

  async findById (id) {
    return await this.controller.findById(id)
  }

  async index (payload) {
    return await this.controller.index(payload)
  }

  async create (payload) {
    return await this.controller.create(payload)
  }

  async update (payload) {
    return await this.controller.update(payload)
  }

  async destroy (payload) {
    return await this.controller.destroy(payload)
  }
}
