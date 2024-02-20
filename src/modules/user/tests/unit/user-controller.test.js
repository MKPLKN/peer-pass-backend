const test = require('brittle')
const { removeUsers } = require('../../../../../tests/helpers.js')
const { createTestApplication } = require('../../../../boot.js')

const app = createTestApplication()
const username = 'test-user'
const password = 'password'

test('user:created event is emitted', async (t) => {
  t.plan(1)

  app.override('eventService', {
    on: () => {},
    emit: (eventName, payload) => {
      t.alike(eventName, 'user:created', 'Event name is correct')
    }
  })
  app.setup()

  await app.container.resolve('userController').create({ username, password, confirmPassword: password })
  await removeUsers()
})
