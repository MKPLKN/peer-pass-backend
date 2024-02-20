process.env.NODE_ENV = 'test'
const fs = require('fs/promises')
const { exec } = require('child_process')
const { promisify } = require('util')
const execProm = promisify(exec)
const { setConfig: setAuthConfig, loadConfigs: loadAuthConfig, createUser } = require('p2p-auth')
const { loadConfigs: loadResourceConfig, setConfig: setResourceConfig } = require('p2p-resources')

function beforeStart () {
  setAuthConfig('usersLocation', './tests/users')
  loadAuthConfig()

  setResourceConfig('resourcesLocation', './tests/resources')
  loadResourceConfig()
}

async function beforeEach (app) {
  const storage = app.container.resolve('storage')
  await removeUsers()
  await storage.clear()
}

async function removeUsers () {
  try {
    // Check if the platform is Windows
    if (process.platform === 'win32') {
      await execProm('rmdir /s /q .\\tests\\users')
      await execProm('rmdir /s /q .\\tests\\resources')
    } else {
      await fs.rm('./tests/users', { recursive: true })
      await fs.rm('./tests/resources', { recursive: true })
    }
  } catch (error) { }
}

async function freshUserSetup ({ username, password, app }) {
  await createUser({ username, password })
  await app.container.resolve('authController').login({ username, password })
}

module.exports = { beforeStart, removeUsers, beforeEach, freshUserSetup }