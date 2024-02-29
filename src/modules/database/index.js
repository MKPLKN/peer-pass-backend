const awilix = require('awilix')
const DatabaseService = require('./database-service')
const DatabaseController = require('./database-controller')
const HandyBeeAdapter = require('./adapters/handybee-adapter')
const HandyBeeFactory = require('./factories/handybee-factory')
const SwarmReplication = require('./replication/swarm-replication')
const ResplicationState = require('./replication/replication-state')
const DatabaseFacade = require('./database.facade')
const DatabaseRegistry = require('./database-registry')

const createDatabaseAdapter = ({ storage, eventService, replicationManager }) => ({ db, type }) => {
  switch (type) {
    case 'handybee':
      return new HandyBeeAdapter({ db, storage, eventService, replicationManager })

    default:
      break
  }
}

const createDatabaseService = ({ eventService }) => (databaseAdapter) => {
  return new DatabaseService({ eventService, databaseAdapter })
}

const createDatabase = ({ container, databaseRegistry, createDatabaseAdapter, createDatabaseService }) => async ({ keyPair, name, type }) => {
  let factory = null
  switch (type) {
    case 'handybee':{
      factory = new HandyBeeFactory()
    }
  }

  const db = await factory.create({ keyPair, name })
  const adapter = createDatabaseAdapter({ db, type })
  const service = createDatabaseService(adapter)
  const prefix = name.replace('@', '')

  container.register({ [`${prefix}DatabaseService`]: awilix.asValue(service) })
  databaseRegistry.addInstance(name, db)
  databaseRegistry.addService(name, service)

  return service
}

function registerModule (container) {
  container.register({
    databaseRegistry: awilix.asClass(DatabaseRegistry).singleton(),
    databaseController: awilix.asClass(DatabaseController).singleton(),
    databaseFacade: awilix.asClass(DatabaseFacade).singleton(),
    // Functions
    createDatabase: awilix.asFunction(createDatabase).singleton(),
    createDatabaseService: awilix.asFunction(createDatabaseService).singleton(),
    createDatabaseAdapter: awilix.asFunction(createDatabaseAdapter).singleton(),
    // Replication
    replicationManager: awilix.asClass(SwarmReplication).singleton(),
    replicationState: awilix.asClass(ResplicationState).singleton()
  })
}

module.exports = { registerDatabaseModule: registerModule }
