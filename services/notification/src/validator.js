import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import addErrors from 'ajv-errors'

const ajv = new Ajv({ allErrors: true })

export default addErrors(addFormats(ajv))
