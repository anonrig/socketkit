import Ajv from 'ajv'
import addErrors from 'ajv-errors'
import addFormats from 'ajv-formats'

const ajv = new Ajv({ allErrors: true, discriminator: true, removeAdditional: true })

export default addErrors(addFormats(ajv))
