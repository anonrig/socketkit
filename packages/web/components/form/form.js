import PropTypes from 'prop-types'
import FormField, { KratosFields } from './field'
import Button from './button'
import { useState } from 'react'
import Link from 'next/link'

function Form({
  active,
  action,
  method,
  fields,
  messages,
  formClassName,
  labelClassName,
  inputClassName,
}) {
  const [isLoading, setLoading] = useState(false)
  return (
    <form className={formClassName} action={action} method={method}>
      {(fields ?? [])
        .map((f) => ({ ...f, ...(KratosFields[f.name] ?? {}) }))
        .sort((a, b) => a.order - b.order)
        .map((field) => (
          <FormField
            key={field.name}
            {...field}
            labelClassName={labelClassName}
            inputClassName={inputClassName}
          />
        ))}
      <div>
        {messages?.map((message) => (
          <p
            key={message.id}
            className="font-medium text-sm mt-2 text-center text-orange-600"
          >
            {message.text}
          </p>
        ))}
      </div>
      <div>
        {active === 'password' && (
          <Button loading={isLoading} type="submit">
            Sign up
          </Button>
        )}

        <Link href="/signin">
          <a className="text-sm text-gray-700 w-full flex justify-center pt-4">Go back to login</a>
        </Link>
      </div>
    </form>
  )
}

Form.propTypes = {
  active: PropTypes.string,
  action: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      required: PropTypes.bool,
      type: PropTypes.string.isRequired,
      value: PropTypes.string,
    }),
  ),
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      context: PropTypes.shape({ property: PropTypes.string }),
      id: PropTypes.number,
      text: PropTypes.string,
      type: PropTypes.string,
    }),
  ),
  formClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  inputClassName: PropTypes.string,
}

export default Form
