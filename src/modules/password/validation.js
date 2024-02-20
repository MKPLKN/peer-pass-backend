const Joi = require('joi')

const baseSchema = Joi.object({
  title: Joi.string().required(),
  identifier: Joi.string().allow(''),
  password: Joi.string().allow(''),
  websites: Joi.array().items(Joi.string().domain({ tlds: { allow: true } }).allow('')),
  note: Joi.string().allow('')
})

function validate (attributes, opts = {}) {
  const { method } = opts

  let schema = null
  switch (method) {
    case 'create':
      schema = baseSchema
      break
    case 'update':
      schema = baseSchema.keys({
        id: Joi.string().required()
      })
      break
    case 'destroy':
      schema = Joi.object({
        id: Joi.string().required()
      })
      break
    default:
      schema = baseSchema
      break
  }

  const { error, value } = schema.validate(attributes)

  if (error) {
    throw new Error(`Validation error: ${error.message}`)
  }

  return value
}

module.exports = validate
