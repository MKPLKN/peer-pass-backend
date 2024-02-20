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

function registerModule (container) {
  container.register({
    authModule: awilix.asClass(AuthModule).singleton(),
    authController: awilix.asClass(AuthController).singleton(),
    authService: awilix.asClass(AuthService).singleton()
  })
}

module.exports = { registerAuthModule: registerModule }
