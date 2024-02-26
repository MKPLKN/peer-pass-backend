module.exports = class ResplicationState {
  constructor ({ eventService }) {
    this.eventService = eventService
  }

  setSwarm (databaseModel, swarm) {
    databaseModel.swarm = swarm
    this.eventService.emit(`database:${databaseModel.key}:set:swarm`, swarm.key)
  }

  emitUpdatedEvent (databaseModel) {
    this.eventService.emit(`database:${databaseModel.key}:replicationState:updated`, databaseModel.getReplicationState())
  }

  inProgress (databaseModel) {
    databaseModel.replicated = false
    databaseModel.replication_status = 'in-progress'
    databaseModel.replication_started_at = null
    databaseModel.replication_stopped_at = null
    this.emitUpdatedEvent(databaseModel)
  }

  replicated (databaseModel) {
    databaseModel.replicated = true
    databaseModel.replication_status = 'replicated'
    databaseModel.replication_started_at = new Date().getTime()
    databaseModel.replication_stopped_at = null
    this.emitUpdatedEvent(databaseModel)
  }

  stopped (databaseModel) {
    databaseModel.replicated = false
    databaseModel.replication_status = 'stopped'
    databaseModel.replication_started_at = null
    databaseModel.replication_stopped_at = new Date().getTime()
    this.emitUpdatedEvent(databaseModel)
  }

  reset (databaseModel) {
    databaseModel.replicated = false
    databaseModel.replication_status = null
    databaseModel.replication_started_at = null
    databaseModel.replication_stopped_at = null
    this.emitUpdatedEvent(databaseModel)
  }
}
