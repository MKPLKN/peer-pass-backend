const { asClass } = require('awilix')
const InMemoryStorage = require('./in-memory-storage')

function registerStorageModule (container, options = {}) {
  let storageImplementation

  switch (options.storage) {
    case 'in-memory':
      storageImplementation = InMemoryStorage
      break
    default:
      throw new Error('Unsupported storage type')
  }

  container.register({
    storage: asClass(storageImplementation).singleton()
  })
}

module.exports = { registerStorageModule }
