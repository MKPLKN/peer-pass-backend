module.exports = class RPCController {
  constructor ({ logger, rpcService, eventService }) {
    this.logger = logger
    this.rpcService = rpcService
    this.eventService = eventService
  }

  async findOrCreate (name) {
    try {
      const resource = await this.rpcService.findOrCreate(name)

      return { success: true, details: resource.details }
    } catch (error) {
      this.logger.error(`RPC findOrCreate failed: ${error.message}`, { error })
      return { success: false }
    }
  }

  async create (payload) {
    try {
      return await this.findOrCreate(payload.name)
    } catch (error) {
      this.logger.error(`RPC create failed: ${error.message}`, { error })
      return { success: false }
    }
  }

  async init (payload) {
    try {
      const rpcModel = await this.rpcService.getRpcModel(payload)

      return { success: true, rpcModel }
    } catch (error) {
      this.logger.error(`RPC init failed: ${error.message}`, { error })
      return { success: false }
    }
  }

  async createServer (payload) {
    try {
      const { rpcModel } = await this.rpcService.createServer(payload)

      return { success: true, rpcModel: rpcModel.getInfo() }
    } catch (error) {
      this.logger.error(`RPC listen failed: ${error.message}`, { error })
      return { success: false }
    }
  }

  async connect (payload) {
    try {
      // payload = { name, key, pubkey }
      const { client, rpcModel } = await this.rpcService.connect(payload)

      return {
        success: true,
        client: { key: client._publicKey.toString('hex') },
        rpcModel: { ...rpcModel.getAttributes() }
      }
    } catch (error) {
      this.logger.error(`RPC connect failed: ${error.message}`, { error })
      return { success: false }
    }
  }

  async req (req) {
    const { key, ck, method, payload: pl } = req
    const rpcModel = await this.rpcService.initByKey(key)
    const client = rpcModel.getClient(ck)

    const payload = { key, ck, ...pl }
    await client.request(method, Buffer.from(JSON.stringify(payload)))
  }

  async res (req) {
    const { key, method, cb } = req
    const rpcModel = await this.rpcService.initByKey(key)
    rpcModel.server.respond(method, cb)
  }

  async teardown () {
    await this.rpcService.teardown()
  }
}
