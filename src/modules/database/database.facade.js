module.exports = class DatabaseFacade {
  constructor ({ databaseController }) {
    this.controller = databaseController
  }

  async getInfo (payload) {
    return await this.controller.getInfo(payload)
  }

  async replicate (payload) {
    return await this.controller.replicate(payload)
  }
}
