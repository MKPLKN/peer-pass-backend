const awilix = require('awilix')
const DHTService = require('./dht-service')
const DHTController = require('./dht-controller')
const DHTFactory = require('./dht-factory')
const DHTRepository = require('./dht-repository')

class DHTModule {
  constructor ({ eventService, DHTService }) {
    this.eventService = eventService
    this.dhtService = DHTService
  }

  registerEventListeners () {
    //
  }
}

function registerModule (container) {
  container.register({
    dhtModule: awilix.asClass(DHTModule).singleton(),
    dhtController: awilix.asClass(DHTController).singleton(),
    dhtService: awilix.asClass(DHTService).singleton(),
    dhtRepository: awilix.asClass(DHTRepository).singleton(),
    dhtFactory: awilix.asClass(DHTFactory).singleton()
  })
}

module.exports = { registerDHTModule: registerModule }
