module.exports = class DHTController {
  constructor ({ logger, dhtService, eventService }) {
    this.logger = logger
    this.dhtService = dhtService
    this.eventService = eventService
  }

  async index (event, payload) {
    try {
      if (!payload) payload = event

      const list = await this.dhtService.index()

      return { success: true, items: list }
    } catch (error) {
      this.logger.error(`DHT index failed: ${error.message}`, { error })
      return { success: false }
    }
  }

  async create (event, payload) {
    try {
      if (!payload) payload = event

      const { details } = await this.dhtService.create(payload)

      return { success: true, details }
    } catch (error) {
      this.logger.error(`DHT create failed: ${error.message}`, { error })
      return { success: false }
    }
  }

  async connect (event, payload) {
    try {
      if (!payload) payload = event
      const { remotePeerAddress } = payload

      const node = await this.dhtService.connect({ remotePeerAddress })

      return { success: true, node }
    } catch (error) {
      this.logger.error(`DHT connect failed: ${error.message}`, { error })
      return { success: false }
    }
  }

  async disconnect (event, payload) {
    try {
      if (!payload) payload = event
      const { key } = payload

      await this.dhtService.disconnect(key)

      return { success: true }
    } catch (error) {
      this.logger.error(`DHT disconnect failed: ${error.message}`, { error })
      return { success: false }
    }
  }
}
