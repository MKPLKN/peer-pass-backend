// This runner is auto-generated by Brittle

runTests()

async function runTests () {
  const test = (await import('brittle')).default

  test.pause()

  await import('./feature/user-controller.test.js')
  await import('./unit/user-controller.test.js')
  // await import('./unit/user-service.test.js')

  test.resume()
}
