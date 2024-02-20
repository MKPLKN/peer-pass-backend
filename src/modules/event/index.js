const awilix = require('awilix')
const EventService = require('./event-service')
const ListenerManager = require('./listener-manager')

function registerModule (container) {
  container.register({
    eventService: awilix.asClass(EventService).singleton(),
    listenerManager: awilix.asClass(ListenerManager).singleton()
  })
}

module.exports = { registeEventModule: registerModule }
