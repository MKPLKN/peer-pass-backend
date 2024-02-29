module.exports = class PasswordRepository {
  constructor ({ passwordFactory, passwordDatabaseService }) {
    this.model = 'password'
    this.factory = passwordFactory
    this.databaseService = passwordDatabaseService
  }

  async getAll (key = 'id') {
    const list = await this.databaseService.query({
      model: this.model,
      where: { [key]: '*' }
    })

    return list
  }

  async find (id) {
    const password = await this.databaseService.query({
      model: this.model,
      where: { id }
    })

    if (!password) {
      throw new Error(`Password not found with an ID: ${id}`)
    }

    return this.factory.make(password)
  }

  async store (password) {
    await this.databaseService.store({
      model: this.model,
      attributes: password.getAttributes()
    })
  }

  async update (password) {
    await this.databaseService.update({
      model: this.model,
      attributes: password.getAttributes()
    })
  }

  async destroy (id) {
    await this.databaseService.destroy({ model: this.model, attributes: { id } })
  }
}
