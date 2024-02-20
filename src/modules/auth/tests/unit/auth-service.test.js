const test = require('brittle')
const { removeUsers } = require('../../../../../tests/helpers.js')
const { createTestApplication } = require('../../../../boot.js')

const username = 'test-user'
const password = 'password'

test('AuthService logs errors on authentication failure', async (t) => {
  t.plan(2)

  const app = createTestApplication()
  app.override('logger', {
    error: (msg, trace) => {
      t.ok(msg.includes('Authentication failed'))
      t.alike(trace.username, username)
    }
  })
  app.setup()

  try {
    await app.container.resolve('authService').authenticate({ username, password })
  } catch (error) {}

  await removeUsers()
})

test('AuthService logs errors on restore failure', async (t) => {
  t.plan(2)

  const app = createTestApplication()
  app.override('logger', {
    error: (msg, trace) => {
      t.ok(msg.includes('Restore failed'))
      t.alike(trace.username, username)
    }
  })
  app.setup()

  try {
    await app.container.resolve('authService').restore({ username, password })
  } catch (error) {}

  await removeUsers()
})
