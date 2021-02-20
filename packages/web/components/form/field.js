import PropTypes from 'prop-types'
import cx from 'classnames'
import fields from './kratos-fields'

function FormField({
  name,
  type,
  value,
  required,
  className,
  labelClassName,
  inputClassName,
  messages,
}) {
  const hasError =
    messages && messages.length > 0 && (messages ?? []).filter((m) => m.type === 'error').length > 0
  const isProvider = name === 'provider'
  const isPicture = name === 'traits.picture'

  if (isProvider || isPicture) {
    return null
  }

  return (
    <div
      className={cx({
        [className]: type !== 'hidden',
      })}>
      {type !== 'hidden' && (
        <div className="flex justify-between">
          <label className={labelClassName} htmlFor={name}>
            {fields[name]?.label ?? name}
          </label>
          {required && <span className="text-sm text-gray-500">Required</span>}
        </div>
      )}
      <div className="relative mt-1">
        <input
          className={cx(inputClassName, {
            'border-red-300': hasError,
            'placeholder-red-300': hasError,
          })}
          defaultValue={value}
          name={name}
          type={fields[name]?.type ?? type}
          required={required}
          hidden={type === 'hidden'}
        />
        {hasError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
      {messages?.map((message) => (
        <p
          className={cx('mt-2 text-sm', {
            'text-red-600': message.type === 'error',
            'text-gray-500': message.type !== 'error',
          })}
          key={message.id}>
          {message.text}
        </p>
      ))}
    </div>
  )
}

FormField.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      context: PropTypes.shape({ property: PropTypes.string }),
      id: PropTypes.number,
      text: PropTypes.string,
      type: PropTypes.string,
    }),
  ),
}

export default FormField
export const KratosFields = fields
