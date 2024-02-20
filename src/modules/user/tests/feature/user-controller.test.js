const test = require('brittle')
const { removeUsers, beforeEach } = require('../../../../../tests/helpers.js')
const { createTestApplication } = require('../../../../boot.js')

const app = createTestApplication()
const username = 'test-user'
const password = 'password'

test('users/create', async (t) => {
  app.setup()
  await beforeEach(app)

  const response = await app.container.resolve('userController').create({ username, password, confirmPassword: password })
  const { seed: mnemonic } = response
  t.ok(mnemonic, 'Mnemonic is returned')

  // Confirm the mnemonic is valid
  const { success } = await app.container.resolve('authController')
    .restore({ username, password, confirmPassword: password, seed: mnemonic })
  t.ok(success, 'Mnemonic is valid')

  await removeUsers()
})

test('users/create failures are logged', async (t) => {
  t.plan(1)

  const app = createTestApplication()
  app.override('logger', {
    error: (msg, trace) => {
      t.ok(true)
    }
  })
  app.setup()
  await beforeEach(app)
  await app.container.resolve('userController').create({ username, password })

  await removeUsers()
})

test('users/create passwords should match', async (t) => {
  t.plan(2)

  const app = createTestApplication()
  app.override('logger', {
    error: (msg, trace) => {
      t.ok(msg.includes('Passwords do not match'))
      t.alike(trace.username, username)
    }
  })
  app.setup()
  await beforeEach(app)
  await app.container.resolve('userController').create({ username, password })
  await removeUsers()
})

test('users/create usernames should be unique', async (t) => {
  t.plan(4)

  const app = createTestApplication()
  app.override('logger', {
    error: (msg, trace) => {
      t.ok(msg.includes('Username already exists'))
      t.alike(trace.username, username)
    }
  })
  app.setup()
  await beforeEach(app)

  // All good, no failures
  const response = await app.container.resolve('userController').create({ username, password, confirmPassword: password })
  t.ok(response.success)

  // Fails, the same username is used
  const response2 = await app.container.resolve('userController').create({ username, password, confirmPassword: password })
  t.is(response2.success, false)

  await removeUsers()
})

test('users/get - it returns the current user', async (t) => {
  app.setup()
  await beforeEach(app)

  // Create user
  await app.container.resolve('userController').create({ username, password, confirmPassword: password })

  // Login
  const { success } = await app.container.resolve('authController').login({ username, password })
  t.ok(success, 'Login response is success')

  // Get the user
  const response = await app.container.resolve('userController').get()
  t.ok(response.success, 'Get reponse is success')
  t.alike(response.username, username, 'Username is correct')

  await removeUsers()
})
