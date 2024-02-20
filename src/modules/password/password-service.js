module.exports = class PasswordService {
  constructor ({ passwordRepository, passwordFactory }) {
    this.repository = passwordRepository
    this.factory = passwordFactory
  }

  async index (key) {
    const passwords = await this.repository.getAll(key)

    return passwords
  }

  async create (attributes) {
    const password = this.factory.create(attributes)

    await this.repository.store(password)

    return password
  }

  async update (attributes) {
    const { id } = attributes
    const password = await this.repository.find(id)

    // Attribute are validated at the controller layer
    Object.keys(attributes).forEach(k => {
      if (password.fillable.has(k)) {
        password.setAttribute(k, attributes[k])
      }
    })
    password.setAttribute('updatedAt', new Date().getTime())
    password.setAttribute('updatedAtHr', process.hrtime.bigint().toString())

    await this.repository.update(password)

    return password
  }

  async destroy (id) {
    const password = await this.repository.find(id)

    await this.repository.destroy(id)

    return password
  }
}
