const awilix = require('awilix')
const AuthController = require('./auth-controller')
const AuthService = require('./auth-service')

class AuthModule {
  constructor ({ ipc, authController }) {
    this.ipc = ipc
    this.controller = authController
  }

  registerRoutes () {
    this.ipc.handle('auth/login', (event, payload) => this.controller.login(payload))
    this.ipc.handle('auth/restore', (event, payload) => this.controller.restore(payload))
  }
}

class AuthFacade {
  constructor ({ authController }) {
    this.controller = authController
  }

  async login (payload) {
    return await this.controller.login(payload)
  }

  async create (payload) {
    return await this.controller.login(payload)
  }
}

function registerModule (container) {
  container.register({
    authModule: awilix.asClass(AuthModule).singleton(),
    authController: awilix.asClass(AuthController).singleton(),
    authService: awilix.asClass(AuthService).singleton(),
    authFacade: awilix.asClass(AuthFacade).singleton()
  })
}

module.exports = { registerAuthModule: registerModule }
