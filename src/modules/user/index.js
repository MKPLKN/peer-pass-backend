const awilix = require('awilix')
const userAuthenticatedListener = require('./listeners/user-authenticated-listener')
const UserService = require('./user-service')
const UserRepository = require('./user-repository')
const UserFactory = require('./user-factory')
const UserController = require('./user-controller')
const UserFacade = require('./user-facade')

class UserModule {
  constructor ({ ipc, eventService, userService, userController }) {
    this.ipc = ipc
    this.eventService = eventService
    this.userService = userService
    this.controller = userController
  }

  registerEventListeners () {
    this.eventService.on('user:authenticated', userAuthenticatedListener({
      userService: this.userService,
      eventService: this.eventService
    }))
  }

  registerRoutes () {
    this.ipc.handle('user/get', () => this.controller.get())
    this.ipc.handle('user/create', (event, payload) => this.controller.get(payload))
  }
}

function registerModule (container) {
  const createUserServices = ({ createDatabase }) => async ({ keyPair }) => {
    await createDatabase({ keyPair, name: '@password', type: 'handybee' })
    await createDatabase({ keyPair, name: '@swarm', type: 'handybee' })
    await createDatabase({ keyPair, name: '@dht', type: 'handybee' })

    // @TODO: I don't think this should be here...
    container.resolve('bootModuleSwarm')(container)
  }

  container.register({
    createUserServices: awilix.asFunction(createUserServices).singleton(),
    userModule: awilix.asClass(UserModule).singleton(),
    userController: awilix.asClass(UserController).singleton(),
    userService: awilix.asClass(UserService).singleton(),
    userRepository: awilix.asClass(UserRepository).singleton(),
    userFactory: awilix.asClass(UserFactory).singleton(),
    userFacade: awilix.asClass(UserFacade).singleton()
  })
}

module.exports = { registerUserModule: registerModule }
