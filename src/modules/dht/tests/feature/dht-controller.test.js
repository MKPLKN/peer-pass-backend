const crypto = require('node:crypto')
const test = require('brittle')
const { removeUsers, beforeEach, freshUserSetup } = require('../../../../../tests/helpers.js')
const { createTestApplication } = require('../../../../boot.js')
const DHTFactory = require('../../dht-factory.js')
const awilix = require('awilix')
const { FakeSocket } = require('../fake-dht-factory.js')

const username = 'test-user'
const password = 'password'

test('dht/create - it creates a new DHT node for the user', async (t) => {
  const app = createTestApplication()
  app.setup()
  await beforeEach(app)
  await freshUserSetup({ app, username, password })
  const user = app.container.resolve('userService').getUser()

  const payload = { name: 'test-dht' }
  const response = await app.container.resolve('dhtController').create(payload)
  t.ok(response.success, 'DHT creation response is success')

  const resource = await user.masterDb.findResourceByName(payload.name)
  t.alike(payload.name, resource.details.name)
  t.alike(response.details.key, resource.details.key)
  t.ok(user.db.key !== user.masterDb.key, 'User has two different databases')

  await removeUsers()
})

test('dht/index - a list of users DHT nodes', async (t) => {
  t.plan(8)
  const app = createTestApplication()
  app.setup()
  await beforeEach(app)
  await freshUserSetup({ app, username, password })
  const dhtController = app.container.resolve('dhtController')

  // Create a few test DHT nodes
  const names = []
  for await (const num of [1, 2, 3]) {
    const payload = { name: `test-dht-${num}` }
    names.push(payload.name)
    const response = await dhtController.create(payload)
    t.ok(response.success, 'DHT creation response is success')
  }

  // Get the list of nodes
  const response = await dhtController.index()
  t.ok(response.success, 'Index response is success')
  t.ok(response.items.length === 3, 'Items count is correct')
  names.forEach(n => {
    t.ok(response.items.find(i => i.getAttributes('name') === n), 'DHT found in the index list')
  })

  await removeUsers()
})

test('dht/connect - it connects the users DHT node to the given pubkey', async (t) => {
  t.plan(11)

  const app = createTestApplication()
  const fakeSocket = new FakeSocket()
  fakeSocket.destroy = () => {
    t.ok(true, 'Destroy called!')
  }
  class DHTFactoryProxy extends DHTFactory {
    initializeDHT (opts) {
      return {
        connect: (key) => {
          t.alike(key.toString('hex'), pubkey, 'Public keys matches')
          return fakeSocket
        }
      }
    }
  }
  app.override('dhtFactory', awilix.asClass(DHTFactoryProxy).singleton(), { asIs: true })
  app.setup()

  await beforeEach(app)
  await freshUserSetup({ app, username, password })

  const pubkey = crypto.randomBytes(32).toString('hex')
  const repository = app.container.resolve('dhtRepository')
  const dhtController = app.container.resolve('dhtController')
  const eventService = app.container.resolve('eventService')

  // If the user does not have any DHT nodes, the app should create one automatically,
  // and use that as the users "default" DHT node
  await dhtController.connect({ remotePeerAddress: pubkey })

  // Confirm the app created default DHT for the user
  const dhtKey = await repository.getDefaultDhtKey()
  const defaultNode = await repository.getDefaultNode()
  t.ok(dhtKey, 'User has default DHT key')
  t.ok(defaultNode, 'User has default DHT node')

  // Confirm connect event is set
  eventService.on('dht:connected', ({ node }) => {
    t.alike(node.getAttributes('name'), defaultNode.details.name)
    t.alike(node.getAttributes('key'), defaultNode.details.key)
  })
  fakeSocket.emit('connect')

  // Confirm closed event is set
  eventService.on('dht:closed', ({ node }) => {
    t.alike(node.getAttributes('name'), defaultNode.details.name)
    t.alike(node.getAttributes('key'), defaultNode.details.key)
  })
  fakeSocket.emit('close')

  // Confirm error event is set
  eventService.on('dht:error', ({ node, error }) => {
    t.alike(node.getAttributes('name'), defaultNode.details.name)
    t.alike(node.getAttributes('key'), defaultNode.details.key)
    t.alike(error.msg, 'fake-error-msg')
  })
  fakeSocket.emit('error', { msg: 'fake-error-msg' })

  // Disconnect the DHT node
  await dhtController.disconnect({ key: defaultNode.details.key })

  await removeUsers()
})

test('dht/disconnect - it disconnect the users DHT node ', async (t) => {
  /**
   * @TODO: Implement this test
   * - This can be quite simple, it just have to call the "destroy" on the given DHT node
   */
  t.ok(true, '** Not implemented **')
})
