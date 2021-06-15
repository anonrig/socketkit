import Ajv from 'ajv'
import errors from 'ajv-errors'
import formats from 'ajv-formats'

const ajv = new Ajv({ allErrors: true })

export default errors(formats(ajv))
