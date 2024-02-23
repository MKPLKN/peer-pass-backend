const awilix = require('awilix')
const PasswordController = require('./password-controller')
const PasswordService = require('./password-service')
const PasswordRepository = require('./password-repository')
const PasswordFactory = require('./password-factory')

class PasswordModule {
  constructor ({ ipc, eventService, passwordService, passwordController }) {
    this.ipc = ipc
    this.eventService = eventService
    this.passwordService = passwordService
    this.controller = passwordController
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

class PasswordFacade {
  constructor ({ passwordController }) {
    this.controller = passwordController
  }

  async find (id) {
    return await this.controller.find(id)
  }

  async findById (id) {
    return await this.controller.findById(id)
  }

  async index (payload) {
    return await this.controller.index(payload)
  }

  async create (payload) {
    return await this.controller.create(payload)
  }

  async update (payload) {
    return await this.controller.update(payload)
  }

  async destroy (payload) {
    return await this.controller.destroy(payload)
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
