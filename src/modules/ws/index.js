const awilix = require('awilix')
const WebSocket = require('ws')

/**
 * WIP: The basic idea for communicating with the browser ext
 *
 * @TODO:
 * - We should not return all passwords in a list, but filter based on the websites
 * - Messages should be encrypted
 *    - 1) User can add a password that is encrypt/decrypt in the extenstion and in the app
 *    - 2) Keypair that is used for encryption
 *    - It should be a nice UX so users would not need to repeately add/auth themselfes in the extenstion
 * - What port to use should be dynamic in case the user's port is in use
 * - We need fault tolerant connection management in general
 *
 * @Notes:
 * - We use ws:// and not wss:// because the communication happens locally.
 *    - However, I think we should still add some encryption in place for messages
 */

class WsModule {
  constructor ({ passwordRepository }) {
    this.repository = passwordRepository
  }

  start () {
    this.wss = new WebSocket.Server({ port: 8080 })

    this.wss.on('connection', this._onConnection.bind(this))
  }

  _onConnection (ws) {
    ws.on('message', async (message) => {
      console.log('received: %s', message)

      try {
        const msg = JSON.parse(message)
        if (msg && msg.method) {
          switch (msg.method) {
            case 'fetchDataForInput':
              await this._fetchDataForInput({ ws, msg })
              break
          }
        }
      } catch (error) {
        //
      }
    })
  }

  async _fetchDataForInput ({ ws, msg }) {
    const list = await this.repository.getAll()
    ws.send(JSON.stringify({
      items: list
    }))
  }
}

function registerWsModule (container) {
  container.register({
    wsModule: awilix.asClass(WsModule).singleton()
  })
}

module.exports = { registerWsModule }
