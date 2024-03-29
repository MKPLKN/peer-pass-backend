const awilix = require('awilix')
const PasswordController = require('./password-controller')
const PasswordService = require('./password-service')
const PasswordRepository = require('./password-repository')
const PasswordFactory = require('./password-factory')
const PasswordFacade = require('./password-facade')

class PasswordModule {
  constructor ({ ipc, eventService }) {
    this.ipc = ipc
    this.eventService = eventService
  }

  registerEventListeners () {
    //
  }

  registerRoutes () {
    this.ipc.handle('password/index', (event, payload) => this.controller.index(payload))
    this.ipc.handle('password/create', (event, payload) => this.controller.create(payload))
    this.ipc.handle('password/update', (event, payload) => this.controller.update(payload))
    this.ipc.handle('password/destroy', (event, payload) => this.controller.destroy(payload))
  }
}

function registerModule (container) {
  container.register({
    passwordModule: awilix.asClass(PasswordModule).singleton(),
    passwordController: awilix.asClass(PasswordController).singleton(),
    passwordService: awilix.asClass(PasswordService).singleton(),
    passwordRepository: awilix.asClass(PasswordRepository).singleton(),
    passwordFactory: awilix.asClass(PasswordFactory).singleton(),
    passwordFacade: awilix.asClass(PasswordFacade).singleton()
  })
}

module.exports = { registerPasswordModule: registerModule }
