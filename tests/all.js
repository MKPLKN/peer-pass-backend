// This runner is auto-generated by Brittle

runTests()

async function runTests () {
  const test = (await import('brittle')).default

  test.pause()

  await import('../src/modules/auth/tests/feature/auth-controller.test.js')
  await import('../src/modules/auth/tests/unit/auth-controller.test.js')
  await import('../src/modules/auth/tests/unit/auth-service.test.js')
  await import('../src/modules/database/tests/feature/replication.test.js')
  await import('../src/modules/dht/tests/feature/dht-controller.test.js')
  await import('../src/modules/password/tests/feature/password-controller.test.js')
  await import('../src/modules/user/tests/feature/user-controller.test.js')
  await import('../src/modules/user/tests/unit/user-controller.test.js')

  test.resume()
}