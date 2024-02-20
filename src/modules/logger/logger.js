module.exports = class ILogger {
  info (msg, trace) {
    throw new Error('Info not implemented')
  }

  error (msg, trace) {
    throw new Error('Info not implemented')
  }

  clear () {
    console.log('Clear method is not implemented')
  }
}
