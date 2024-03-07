const test = require('brittle')
const awilix = require('awilix')
const { removeUsers, beforeEach, freshUserSetup } = require('../../../../../tests/helpers.js')
const { createTestApplication } = require('../../../../boot.js')

const { FakeSocket, FakeRPCFactory } = require('../fake-rpc-factory.js')
const { FakeDHTFactory } = require('../../../dht/tests/fake-dht-factory.js')

const username = 'test-user'
const password = 'password'

const app = createTestApplication()
const fakeSocket = new FakeSocket()
fakeSocket.destroy = () => {
  //
}
fakeSocket.listen = () => {
  //
}
class RPCFactoryProxy extends FakeRPCFactory {
  _connect (key) {
    return fakeSocket
  }

  initializeRPC (opts) {
    return {
      createServer: () => {
        return fakeSocket
      },
      connect: this._connect
    }
  }
}
app.override('dhtFactory', awilix.asClass(FakeDHTFactory).singleton(), { asIs: true })
app.override('rpcFactory', awilix.asClass(RPCFactoryProxy).singleton(), { asIs: true })
app.setup()

test('rpc/create - it creates a new DHT and RPC for the user', async (t) => {
  await beforeEach(app)
  await freshUserSetup({ app, username, password })

  const storage = app.container.resolve('storage')
  const rpcController = app.container.resolve('rpcController')
  const db = app.container.resolve('databaseRegistry').getInstance('@dht')

  const payload = { name: 'test-rpc' }
  const response = await rpcController.create(payload)
  t.ok(response.success, 'RPC creation response is success')

  const resource = await db.db.findResourceByName(payload.name)
  t.alike(payload.name, resource.details.name)
  t.alike(response.details.key, resource.details.key)

  // Init, if name is not found it should create DHT node
  const { rpcModel } = await rpcController.init({ name: 'test-rpcs' })
  t.ok(storage.get('rpc').get('initialized').get(rpcModel.key), 'RPC is found from the cache')

  const resource2 = await db.db.findResourceByName('test-rpcs')
  t.alike('test-rpcs', resource2.details.name)
  t.alike(rpcModel.key, resource2.details.key)

  await removeUsers()
})

test('rpc/createServer - it creates RPC server ', async (t) => {
  await beforeEach(app)
  await freshUserSetup({ app, username, password })

  const rpcController = app.container.resolve('rpcController')

  const payload = { name: 'test-rpc' }
  const response = await rpcController.createServer(payload)
  t.ok(response.success, 'RPC creation response is success')

  await removeUsers()
})

test('rpc/connect - it connects the RPC server to given pubkey', async (t) => {
  t.plan(1)
  await beforeEach(app)
  await freshUserSetup({ app, username, password })

  const rpcFactory = app.container.resolve('rpcFactory')
  rpcFactory._connect = (key) => {
    t.alike(key.toString('hex'), '750a7c8f', 'It connects to correct pubkey')
    fakeSocket._publicKey = key
    return fakeSocket
  }

  const rpcController = app.container.resolve('rpcController')
  await rpcController.createServer({ name: 'test-rpc' })
  await rpcController.connect({ name: 'test-rpc', pubkey: '750a7c8f' })

  await removeUsers()
})
