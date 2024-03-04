const test = require('brittle')
const { removeUsers, beforeEach, freshUserSetup } = require('../../../../../tests/helpers.js')
const { createTestApplication } = require('../../../../boot.js')
const awilix = require('awilix')
const { FakeSwarmFactory, FakeSwarm, FakeDiscovery, FakeSocket } = require('../../../swarm/tests/fake-swarm-factory.js')

const username = 'test-user'
const password = 'password'

test('user can replicate its database via Swarm', async (t) => {
  await removeUsers()

  t.plan(20)

  class MyFakeSwarmFactory extends FakeSwarmFactory {
    initializeSwarm (opts) {
      const swarm = new FakeSwarm(opts)
      swarm.join = (topic) => {
        t.alike(topic, db.topic, 'Joined to correct topic')
        const key = db.swarm.getAttributes('key')
        eventService.on(`swarm:${key}:joined:${db.topic.toString('hex')}`, ({ databaseModel }) => {
          t.alike(databaseModel.key, db.key, 'Database model is correct')
        })
        const dis = new FakeDiscovery()
        dis.flushed = () => {
          t.ok(true, 'Flushed')
        }
        return dis
      }
      return swarm
    }
  }

  const app = createTestApplication()
  app.override('swarmFactory', awilix.asClass(MyFakeSwarmFactory).singleton(), { asIs: true })

  await beforeEach(app)
  await freshUserSetup({ app, username, password })
  const eventService = app.container.resolve('eventService')
  const listenerManager = app.container.resolve('listenerManager')
  const databaseRegistry = app.container.resolve('databaseRegistry')
  const db = databaseRegistry.getInstance('@password')

  t.absent(db.swarm, 'User database has not swarm instance before replication')
  t.absent(db.replication_status, 'DBs replication status is absent before replication')
  const response = await app.container.resolve('databaseController').replicate({ name: '@password' })
  t.ok(response.success, 'DB replication response is success')

  const socket = new FakeSocket()
  eventService.on('swarm:setup:completed', async () => {
    // User has swarm set up
    t.ok(db.swarm, 'User database has swarm instance after replication')
    // Correct replication status
    t.alike(db.replication_status, 'in-progress', 'DBs replication status is set to "in-progress"')

    // All listeners are set up
    const dbKey = db.key
    t.ok(listenerManager.get(`swarm:${db.swarm.key}:connection._handleReplication:${dbKey}`), 'Replication listener is set for swarm connection event')

    // This is the Hyperbee's replicate function
    db.db.replicate = async (s) => {
      t.alike(s.remotePublicKey.toString('hex'), socket.remotePublicKey.toString('hex'), 'Replication is called with correct socket')
    }

    // Fake swarm connection
    db.swarm.hyperswarm.emit('connection', socket)
    t.alike(db.replication_status, 'replicated', 'DBs replication status is set to "replicated"')

    // After connection, it should set listeners for the socket events
    const remotePubkey = socket.remotePublicKey.toString('hex')
    t.ok(listenerManager.get(`swarm:${db.swarm.key}:close:${remotePubkey}._socketOnClose:${dbKey}`), 'Listener is set for socket close event')
    t.ok(listenerManager.get(`swarm:${db.swarm.key}:error:${remotePubkey}._socketOnError:${dbKey}`), 'Listener is set for socket error event')

    // Fake close event
    socket.emit('close')
    // Remove event listeners for the socket
    t.absent(listenerManager.get(`swarm:${db.swarm.key}:close:${remotePubkey}._socketOnClose:${dbKey}`), 'Listener for swarm close event removed')
    t.absent(listenerManager.get(`swarm:${db.swarm.key}:error:${remotePubkey}._socketOnError:${dbKey}`), 'Listener for swarm error event removed')

    // Fake swarm connection
    db.swarm.hyperswarm.emit('connection', socket)
    t.ok(listenerManager.get(`swarm:${db.swarm.key}:close:${remotePubkey}._socketOnClose:${dbKey}`), 'Listener is set for socket close event')
    t.ok(listenerManager.get(`swarm:${db.swarm.key}:error:${remotePubkey}._socketOnError:${dbKey}`), 'Listener is set for socket error event')

    // Fake error event
    socket.emit('error', {})
    t.absent(listenerManager.get(`swarm:${db.swarm.key}:close:${remotePubkey}._socketOnClose:${dbKey}`), 'Listener for swarm close event removed')
    t.absent(listenerManager.get(`swarm:${db.swarm.key}:error:${remotePubkey}._socketOnError:${dbKey}`), 'Listener for swarm error event removed')

    /**
     * @TODO:
     * - We should update the DB replication status if there are no active connections in the swarm
     * - We should have dedicated tests for socket close/error events and their behaviors
     */

    await removeUsers()
  })
})
