module.exports = class DatabaseFacade {
  constructor ({ databaseController }) {
    this.controller = databaseController
  }

  async replicate (payload) {
    return await this.controller.replicate(payload)
  }
}
