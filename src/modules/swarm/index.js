const awilix = require('awilix')
const SwarmService = require('./swarm-service')
const SwarmController = require('./swarm-controller')
const SwarmFactory = require('./swarm-factory')
const SwarmRepository = require('./swarm-repository')

class SwarmModule {
  constructor ({ eventService, swarmService }) {
    this.eventService = eventService
    this.swarmService = swarmService
  }

  registerEventListeners () {
    this.eventService.on('swarm:setup', async ({ swarmKey, databaseModel }) => {
      if (!databaseModel) return

      const swarm = await this.swarmService.setup({ swarmKey })
      if (swarm) {
        this.eventService.emit('swarm:setup:completed', { databaseModel, swarm })
      } else {
        this.eventService.emit('swarm:setup:failure', { databaseModel, swarm })
      }
    })
  }
}

function registerModule (container) {
  container.register({
    swarmModule: awilix.asClass(SwarmModule).singleton(),
    swarmController: awilix.asClass(SwarmController).singleton(),
    swarmRepository: awilix.asClass(SwarmRepository).singleton(),
    swarmService: awilix.asClass(SwarmService).singleton(),
    swarmFactory: awilix.asClass(SwarmFactory).singleton()
  })
}

module.exports = { registerSwarmModule: registerModule }
