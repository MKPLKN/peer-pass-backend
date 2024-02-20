module.exports = class SwarmController {
  constructor ({ swarmService, eventService }) {
    this.swarmService = swarmService
    this.eventService = eventService
  }

  async create (event, payload) {
    try {
      if (!payload) payload = event

      await this.swarmService.create(payload)

      return { success: true }
    } catch (error) {
      return { success: false }
    }
  }
}
