module.exports = class DatabaseController {
  constructor ({ logger, eventService, databaseRegistry }) {
    this.logger = logger
    this.eventService = eventService
    this.registry = databaseRegistry
  }

  // @TODO: write tests
  async getInfo (payload = {}) {
    try {
      const { name } = payload
      const service = this.registry.getService(name)
      const info = await service.getInfo()

      return { success: true, info }
    } catch (error) {
      this.logger.error(`Get keys failed: ${error.message}`, { error })
      return { success: false }
    }
  }

  async teardown (payload) {
    try {
      if (payload.name) {
        const service = this.registry.getService(payload.name)
        await service.teardown()
      } else {
        for await (const item of this.registry.storage.get('database.services')) {
          const service = item[1]
          await service.teardown()
        }
      }
    } catch (error) {
      this.logger.error(error.message)
    }
  }

  async replicate (event = {}, payload) {
    try {
      if (!payload) payload = event
      const { name, swarmKey } = payload
      const service = this.registry.getService(name)

      if (!service.replicationSupported()) {
        throw new Error('Current database does not support replication')
      }

      if (service.isReplicated() || service.replicationInProgress()) {
        throw new Error('Current database is already replicated, or is waiting to be replicated')
      }

      service.startReplication({ swarmKey })

      return { success: true }
    } catch (error) {
      this.logger.error(`Replication failed: ${error.message}`, { error })
      return { success: false }
    }
  }
}
