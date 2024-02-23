const { createApplication } = require('./src/boot')
const { beforeStart: helpersBeforeStart } = require('./tests/helpers')

/**
 * Create container
 *
 */
const fakeIpc = { handle: () => { } }
const { container, setup } = createApplication({ ipcMain: fakeIpc })
setup()

/**
 * Facades
 *
 */
const authFacade = container.resolve('authFacade')
const userFacade = container.resolve('userFacade')
const passwordFacade = container.resolve('passwordFacade')

module.exports = { authFacade, userFacade, passwordFacade, beforeStart }

function beforeStart (opts = {}) {
  const dir = opts.devUsersDir
  helpersBeforeStart(dir)
}
