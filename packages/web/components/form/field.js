import PropTypes from 'prop-types'
import cx from 'classnames'
import fields from './kratos-fields'

function FormField({ name, type, value, required, className, messages }) {
  const hasError =
    messages && messages.length > 0 && (messages ?? []).filter((m) => m.type === 'error').length > 0
  const isProvider = name === 'provider'
  const isPicture = name === 'traits.picture'
  const isButton = type === 'submit'

  if (isProvider || isPicture || isButton) {
    return null
  }

  return (
    <div
      className={cx({
        [className]: type !== 'hidden',
      })}>
      {type !== 'hidden' && (
        <label className={'block text-sm font-medium text-gray-700'} htmlFor={name}>
          {fields[name]?.label ?? name}
        </label>
      )}
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          autoComplete="on"
          className={cx(
            'appearance-none block w-full px-3 py-2 border border-warmGray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm',
            {
              'border-red-500': hasError,
              'placeholder-red-500': hasError,
            },
          )}
          defaultValue={value}
          required={required}
          name={name}
          type={fields[name]?.type ?? type}
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
            'text-red-500': message.type === 'error',
            'text-trueGray-500': message.type !== 'error',
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
