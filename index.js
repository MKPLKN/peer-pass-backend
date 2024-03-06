const { createApplication } = require('./src/boot')
const { beforeStart: helpersBeforeStart } = require('./tests/helpers')

/**
 * Create container
 *
 */
const fakeIpc = { handle: () => { } }
const { container, setup } = createApplication({ ipcMain: fakeIpc })
setup()

const eventService = container.resolve('eventService')
const listenerManager = container.resolve('listenerManager')

/**
 * Facades
 *
 */
function getFacade (name) {
  switch (name) {
    case 'password':
      return container.hasRegistration('passwordDatabaseService')
        ? container.resolve('passwordFacade')
        : null
    case 'rpc':
      return container.hasRegistration('dhtDatabaseService')
        ? container.resolve('rpcFacade')
        : null
  }
}
const authFacade = container.resolve('authFacade')
const userFacade = container.resolve('userFacade')
const databaseFacade = container.resolve('databaseFacade')
module.exports = {
  eventService,
  listenerManager,
  getFacade,
  authFacade,
  userFacade,
  databaseFacade,
  beforeStart
}

function beforeStart (opts = {}) {
  const dir = opts.devUsersDir
  helpersBeforeStart(dir)
}
