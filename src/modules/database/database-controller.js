module.exports = class DatabaseController {
  constructor ({ logger, eventService, databaseService }) {
    this.logger = logger
    this.eventService = eventService
    this.databaseService = databaseService
  }

  // @TODO: write tests
  async getInfo (payload) {
    try {
      const info = await this.databaseService.getInfo()

      return { success: true, info }
    } catch (error) {
      this.logger.error(`Get keys failed: ${error.message}`, { error })
      return { success: false }
    }
  }

  async teardown () {
    await this.databaseService.teardown()
  }

  async replicate (event = {}, payload) {
    try {
      if (!payload) payload = event
      const { swarmKey } = payload

      if (!this.databaseService.replicationSupported()) {
        throw new Error('Current database does not support replication')
      }

      if (this.databaseService.isReplicated() || this.databaseService.replicationInProgress()) {
        throw new Error('Current database is already replicated, or is waiting to be replicated')
      }

      this.databaseService.startReplication({ swarmKey })

      return { success: true }
    } catch (error) {
      this.logger.error(`Replication failed: ${error.message}`, { error })
      return { success: false }
    }
  }
}
