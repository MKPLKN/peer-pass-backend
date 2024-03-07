const awilix = require('awilix')
const RPCService = require('./rpc-service')
const RPCController = require('./rpc-controller')
const RPCFactory = require('./rpc-factory')
const RPCRepository = require('./rpc-repository')
const RpcFacade = require('./rpc-facade')

class RPCModule { }

function registerModule (container) {
  container.register({
    rpcModule: awilix.asClass(RPCModule).singleton(),
    rpcController: awilix.asClass(RPCController).singleton(),
    rpcService: awilix.asClass(RPCService).singleton(),
    rpcRepository: awilix.asClass(RPCRepository).singleton(),
    rpcFactory: awilix.asClass(RPCFactory).singleton(),
    rpcFacade: awilix.asClass(RpcFacade).singleton()
  })
}

module.exports = { registerRPCModule: registerModule }
