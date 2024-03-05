module.exports = class DatabaseFacade {
  constructor ({ databaseController }) {
    this.controller = databaseController
  }

  async getInfo (payload) {
    return await this.controller.getInfo(payload)
  }

  async teardown (payload = {}) {
    return await this.controller.teardown(payload)
  }

  async replicate (payload) {
    return await this.controller.replicate(payload)
  }
}
