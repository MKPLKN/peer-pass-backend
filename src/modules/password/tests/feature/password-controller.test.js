const test = require('brittle')
const { removeUsers, beforeEach, freshUserSetup } = require('../../../../../tests/helpers.js')
const { createTestApplication } = require('../../../../boot.js')

const app = createTestApplication()
const username = 'test-user'
const password = 'password'

async function createPassword (app, attirbutes = {}) {
  const { password } = await app.container.resolve('passwordController')
    .create({
      title: 'Test password',
      identifier: '', // Email, username, ....
      password: '',
      websites: [''],
      note: '',
      ...attirbutes
    })

  return password
}

test('password/create - it creates a new password for the user', async (t) => {
  app.setup()
  await beforeEach(app)
  await freshUserSetup({ app, username, password })

  const payload = {
    title: 'Test password',
    identifier: '', // Email, username, ....
    password: '',
    websites: [''],
    note: ''
  }
  const response = await app.container.resolve('passwordController').create(payload)
  t.ok(response.success, 'Password creation response is success')
  t.alike(response.password.title, payload.title, 'Password title is correct')
  t.ok(response.password.id, 'Password has an ID')

  const pw = await app.container.resolve('passwordRepository').find(response.password.id)
  t.alike(response.password.id, pw.getAttributes('id'), 'Password ID matches')
  t.alike(response.password.title, pw.getAttributes('title'), 'Password title matches')

  await removeUsers()
})

test('password/update - user can update a password record', async (t) => {
  app.setup()
  await beforeEach(app)
  await freshUserSetup({ app, username, password })

  const pwRecord = await createPassword(app)

  const newTitle = 'Updated Test Password'
  const response = await app.container.resolve('passwordController').update({
    id: pwRecord.id,
    title: newTitle
  })
  t.ok(response.success, 'Password update response is success')
  t.alike(response.password.title, newTitle, 'Password title is updated')

  const pw = await app.container.resolve('passwordRepository').find(response.password.id)
  t.alike(response.password.id, pw.getAttributes('id'), 'Password ID matches')
  t.alike(response.password.title, pw.getAttributes('title'), 'Password title matches')

  await removeUsers()
})

test('password/destroy - user can destroy a password record', async (t) => {
  app.setup()
  await beforeEach(app)
  await freshUserSetup({ app, username, password })

  const pwRecord = await createPassword(app)

  const response = await app.container.resolve('passwordController').destroy({ id: pwRecord.id })
  t.ok(response.success, 'Password destory response is success')

  try {
    await app.container.resolve('passwordRepository').find(pwRecord.id)
  } catch (error) {
    t.ok(error.message.includes('Password not found'), 'Password not found')
  }

  await removeUsers()
})

test('password/index - user can view all its password records', async (t) => {
  const app = createTestApplication()
  app.setup()
  await beforeEach(app)
  await freshUserSetup({ app, username, password })

  await createPassword(app, { title: 'Test password 1' }, app)
  await createPassword(app, { title: 'Test password 2' }, app)
  await createPassword(app, { title: 'Test password 3' }, app)
  await createPassword(app, { title: 'Test password 4' }, app)

  const response = await app.container.resolve('passwordController').index()
  t.ok(response.items.length === 4, 'All passwords are returned')
  t.ok(response.success, 'Password index response is success')

  // Password are returned in the correct order
  const { items } = await app.container.resolve('passwordController').index({ key: 'createdAtHr' })
  t.ok(items.length === 4, 'All passwords are returned')
  items.forEach((password, index) => {
    t.ok(`Test password ${index + 1}` === password.title, 'Password are returned in the correct order')
  })

  await removeUsers()
})
