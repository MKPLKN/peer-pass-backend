const test = require('brittle')
const { createUser } = require('p2p-auth')
const { removeUsers } = require('../../../../../tests/helpers.js')
const { createTestApplication } = require('../../../../boot.js')

const app = createTestApplication()
const username = 'test-user'
const password = 'password'

test('user:authenticated event is emitted', async (t) => {
  t.plan(5)

  app.override('eventService', {
    on: () => {},
    emit: (eventName, payload) => {
      t.alike(eventName, 'user:authenticated', 'Event name is correct')
      t.ok(payload.user, 'User is present')
      t.alike(payload.user.username, username, 'Username matches')
      t.ok(payload.user.keyPair.publicKey, 'Keypair has public key')
      t.ok(payload.user.keyPair.secretKey, 'Keypair has secret key')
    }
  })
  app.setup()

  await createUser({ username, password })
  await app.container.resolve('authController').login({ username, password })
  await removeUsers()
})
