module.exports = class SwarmService {
  constructor ({ logger, eventService, swarmFactory, swarmRepository }) {
    this.logger = logger
    this.eventService = eventService
    this.factory = swarmFactory
    this.repository = swarmRepository
  }

  make (opts = {}) {
    return this.factory.make(opts)
  }

  init (opts = {}) {
    return this.factory.init(opts)
  }

  async create (attributes) {
    const { setAsDefault, name } = attributes
    if (!name) {
      attributes.name = this.factory.randomName()
    }
    const { details } = await this.repository.create(attributes)

    if (details && details.resourceKey && setAsDefault) {
      await this.repository.setDefaultSwarmKey(details.resourceKey)
    }

    return { details }
  }

  async getDefaultSwarm () {
    return this.repository.getDefaultSwarm()
  }

  async disconnect (swarmModel) {
    if (swarmModel.hyperswarm) {
      await swarmModel.hyperswarm.destroy()
    }
  }

  async setup ({ swarmKey }) {
    if (!swarmKey) {
      let defaultSwarm = await this.getDefaultSwarm()
      if (!defaultSwarm) {
        defaultSwarm = await this.create({ setAsDefault: true })
      }
      swarmKey = defaultSwarm?.details?.resourceKey
    }

    if (!swarmKey) {
      throw new Error('Swarm key not found!')
    }

    // Find user's Swarm and initialize it
    const resource = await this.repository.findByResourceKey(swarmKey)
    if (!resource || !resource.details || !resource.details.opts) return
    const swarm = this.factory.init(resource.details, resource.details.opts)

    // Basic setup
    const { hyperswarm } = swarm
    hyperswarm.on('connection', (socket) => this._onSwarmConnection({ socket, swarm }))
    hyperswarm.on('update', () => this._onSwarmUpdate({ swarm }))

    return swarm
  }

  _onSwarmUpdate ({ swarm }) {
    const key = swarm.getAttributes('key')
    this.eventService.emit(`swarm:${key}:update`, { swarm })
  }

  _onSwarmConnection ({ socket, swarm }) {
    const key = swarm.getAttributes('key')
    this.eventService.emit(`swarm:${key}:connection`, { socket })

    socket.on('close', () => this._socketOnClose({ socket, swarm }))
    socket.on('error', (error) => this._socketOnError({ error, socket, swarm }))
  }

  _socketOnError ({ error, socket, swarm }) {
    this.logger.error(`** Socket on error: ${error.message}`, error)
    const key = swarm.getAttributes('key')
    const remotePubkey = socket.remotePublicKey.toString('hex')
    this.eventService.emit(`swarm:${key}:error:${remotePubkey}`, { error, socket, swarm })
  }

  _socketOnClose ({ socket, swarm }) {
    const key = swarm.getAttributes('key')
    const remotePubkey = socket.remotePublicKey.toString('hex')
    this.eventService.emit(`swarm:${key}:close:${remotePubkey}`, { socket, swarm })
    this.logger.info(`** Swarm connection closed: ${remotePubkey} on swarm: ${key}`)
  }
}
