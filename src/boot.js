const awilix = require('awilix')
const { registerAuthModule } = require('./modules/auth')
const { registeEventModule } = require('./modules/event')
const { registerUserModule } = require('./modules/user')
const { registerStorageModule } = require('./modules/storage')
const { registerLoggerModule } = require('./modules/logger')
const { registerPasswordModule } = require('./modules/password')
const { registerDatabaseModule } = require('./modules/database')
const { registerDHTModule } = require('./modules/dht')
const { registerSwarmModule } = require('./modules/swarm')
const { beforeStart } = require('../tests/helpers')
const { registerRPCModule } = require('./modules/rpc')
// const { registerWsModule } = require('./modules/ws')

function createApplication ({ ipcMain } = {}) {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
    strict: true
  })

  container.register({ container: awilix.asValue(container) })
  container.register({ ipc: awilix.asValue(ipcMain || {}) })

  registeEventModule(container)
  registerStorageModule(container, { storage: 'in-memory' })
  registerLoggerModule(container, { logger: 'winston' })
  registerAuthModule(container)
  registerUserModule(container)
  registerDatabaseModule(container)
  registerPasswordModule(container)
  registerDHTModule(container)
  registerRPCModule(container)
  registerSwarmModule(container)

  // Setup phase
  const setup = () => {
    /**
     * WebSocket Example
     */
    // registerWsModule(container)
    // const ws = container.resolve('wsModule')
    // ws.start()
  }

  return { container, setup }
}

function createTestApplication () {
  const fakeIpc = { handle: () => { } }
  const app = createApplication({ ipcMain: fakeIpc })

  beforeStart()

  // Let's mute the logger by default
  app.container.register('logger', awilix.asValue({
    info: noop,
    error: (msg, trace) => console.log('****', msg, trace)
  }))

  return {
    ...app,
    override: (name, mock, opts = {}) => {
      const { asIs } = opts
      if (app.container.hasRegistration(name)) {
        if (asIs) {
          app.container.register(name, mock)
        } else {
          app.container.register(name, awilix.asValue(mock))
        }
      }
    }
  }
}

function noop () {
  return () => {}
}

module.exports = { createApplication, createTestApplication }
