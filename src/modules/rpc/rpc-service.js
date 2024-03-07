module.exports = class RPCService {
  constructor ({ dhtService, eventService, rpcRepository, rpcFactory, logger }) {
    this.dhtService = dhtService
    this.eventService = eventService
    this.repository = rpcRepository
    this.factory = rpcFactory
    this.logger = logger
  }

  make (attributes) {
    return this.factory.make(attributes)
  }

  init (attributes, opts) {
    return this.factory.init(attributes, opts)
  }

  async create (attributes) {
    return await this.dhtService.create(attributes)
  }

  async findOrCreate (name) {
    if (!name) throw new Error('Name is required')
    const resource = await this.findByName(name)

    if (!resource.error) return resource

    // @TODO: confirm the error is 404 not found
    // if(response.error.code === 404) { }

    // Create DHT node
    return await this.create({ name })
  }

  async findByName (name) {
    return await this.dhtService.findByName(name)
  }

  async getRpcModel (payload) {
    const { name, key } = payload
    if (!name && !key) throw new Error('Name or key is required')
    const k = key || (await this.findOrCreate(name))?.details?.key
    return await this.initByKey(k)
  }

  async createServer ({ name, key }) {
    const rpcModel = await this.getRpcModel({ name, key })

    rpcModel.server = rpcModel.rpc.createServer()
    await rpcModel.server.listen()

    this.logger.info(`Server created: ${rpcModel.server.publicKey.toString('hex')}`)

    rpcModel.server.on('connection', (rpc) => this._serverOnConnection({ rpc, rpcModel }))

    return { server: rpcModel.server, rpcModel }
  }

  async initByKey (key) {
    const cacheKey = `rpc.initialized.${key}`
    const fromCache = this.repository.getStorage(cacheKey)
    if (fromCache) return fromCache

    const dhtModel = await this.dhtService.initByKey(key)
    const attributes = { key, name: dhtModel.getAttributes('name') }
    const rpcModel = await this.init(attributes, { dht: dhtModel.dht })
    this.repository.setStorage(cacheKey, rpcModel)

    return rpcModel
  }

  async connect ({ name, key, pubkey }) {
    const k = key || (await this.findOrCreate(name))?.details?.key
    if (!k) throw new Error('Key is not found')
    const rpcModel = await this.initByKey(k)

    const pubkeyBuf = typeof pubkey === 'string' ? Buffer.from(pubkey, 'hex') : pubkey
    const pubkeyHex = typeof pubkey === 'string' ? pubkey : pubkey.toString('hex')
    const client = rpcModel.rpc.connect(pubkeyBuf)

    rpcModel.addClient(pubkeyHex, client)

    client.on('error', (error) => this._clientOnError({ rpcModel, key: pubkeyHex, error }))
    client.on('close', () => this._clientOnClose({ rpcModel, key: pubkeyHex }))
    client.on('open', () => this._clientOnOpen({ rpcModel, key: pubkeyHex }))

    return { client, rpcModel }
  }

  _serverOnConnection ({ rpc, rpcModel }) {
    this.logger.info('Server got connection')
  }

  _clientOnError ({ rpcModel, key, error }) {
    rpcModel.deleteClient(key)
    this.logger.error(`Client error ${key}: ${error.message}`)
    this.eventService.emit('client:error', { rpcModel, key, error })
    this.eventService.emit(`rpc:${rpcModel.key}:client:${key}:error`, { rpcModel, key, error })
  }

  _clientOnClose ({ rpcModel, key }) {
    rpcModel.deleteClient(key)
    this.logger.info(`Client ${key} closed on RPC ${rpcModel.key}`)
    this.eventService.emit(`rpc:${rpcModel.key}:client:${key}:closed`, { rpcModel, key })
  }

  _clientOnOpen ({ rpcModel, key }) {
    this.logger.info(`Client ${key} opened on RPC ${rpcModel.key}`)
    this.eventService.emit(`rpc:${rpcModel.key}:client:${key}:open`, { rpcModel, key })
  }

  async teardown () {
    for await (const arr of this.repository.getAll()) {
      const rpcModel = arr[1]
      await rpcModel.rpc.destroy()
      await rpcModel.rpc.dht.destroy()
    }
  }
}
