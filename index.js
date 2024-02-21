const { createApplication } = require('./src/boot')

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

module.exports = { authFacade, userFacade }
