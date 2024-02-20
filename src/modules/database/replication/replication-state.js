module.exports = class ResplicationState {
  setSwarm (databaseModel, swarm) {
    databaseModel.swarm = swarm
  }

  inProgress (databaseModel) {
    databaseModel.replicated = false
    databaseModel.replication_status = 'in-progress'
    databaseModel.replication_started_at = null
    databaseModel.replication_stopped_at = null
  }

  replicated (databaseModel) {
    databaseModel.replicated = true
    databaseModel.replication_status = 'replicated'
    databaseModel.replication_started_at = new Date().getTime()
    databaseModel.replication_stopped_at = null
  }

  stopped (databaseModel) {
    databaseModel.replicated = false
    databaseModel.replication_status = 'stopped'
    databaseModel.replication_started_at = null
    databaseModel.replication_stopped_at = new Date().getTime()
  }

  reset (databaseModel) {
    databaseModel.replicated = false
    databaseModel.replication_status = null
    databaseModel.replication_started_at = null
    databaseModel.replication_stopped_at = null
  }
}
