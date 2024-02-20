const test = require('brittle')
const { createUser } = require('p2p-auth')
const { removeUsers, beforeEach } = require('../../../../../tests/helpers.js')
const { createTestApplication } = require('../../../../boot.js')

const app = createTestApplication()
const username = 'test-user'
const password = 'password'

test('auth/login', async (t) => {
  app.setup()
  await beforeEach(app)
  await createUser({ username, password })

  const storage = app.container.resolve('storage')
  t.absent(storage.get('user'))
  const response = await app.container.resolve('authController').login({ username, password })
  t.ok(response.success)
  const user = storage.get('user')
  t.ok(user)
  t.ok(user.db)

  // @TODO: Test the application does not use the user's master DB
  // -

  await removeUsers()
})

test('auth/login failures are logged', async (t) => {
  t.plan(2)

  const app = createTestApplication()
  app.override('logger', {
    error: (msg, trace) => {
      if (msg.includes('Login failed')) {
        t.ok(msg.includes('Login failed'))
        t.alike(trace.username, username)
      }
    }
  })
  app.setup()

  await beforeEach(app)
  await createUser({ username, password })
  await app.container.resolve('authController').login({ username, password: 'wrong' })
  await removeUsers()
})

test('auth/restore', async (t) => {
  app.setup()
  await beforeEach(app)
  const createdUser = await createUser({ username, password })
  await removeUsers()

  const authController = app.container.resolve('authController')
  // Fails, no users found
  const { success } = await authController.login({ username, password })
  t.is(success, false)

  // Restore
  await authController.restore({ username, password, confirmPassword: password, seed: createdUser.mnemonic })

  // Success, user restored
  const storage = app.container.resolve('storage')
  t.absent(storage.get('user'))
  const { success: success2 } = await authController.login({ username, password })
  t.ok(storage.get('user'))
  t.is(success2, true)

  await removeUsers()
})

test('auth/restore failures are logged', async (t) => {
  t.plan(2)

  const app = createTestApplication()
  app.override('logger', {
    error: (msg, trace) => {
      if (msg.includes('Restore failed:')) {
        t.ok(msg.includes('Restore failed:'))
        t.alike(trace.username, username)
      }
    }
  })
  app.setup()

  await beforeEach(app)
  await createUser({ username, password })
  await app.container.resolve('authController')
    .restore({ username, password, confirmPassword: password, seed: 'wrong-seed' })
  await removeUsers()
})
