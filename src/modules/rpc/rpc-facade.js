module.exports = class RpcFacade {
  constructor ({ rpcController }) {
    this.controller = rpcController
  }

  async init (payload) {
    return await this.controller.init(payload)
  }

  async teardown () {
    return await this.controller.teardown()
  }
}
