import cx from 'classnames'
import PropTypes from 'prop-types'

import fields from './kratos-fields'

function FormField({ className, messages, meta, attributes, type }) {
  const { value, ...extra_attributes } = attributes
  const hasError = messages?.length > 0 && messages?.filter((m) => m.type === 'error')?.length > 0

  if (['traits.picture', 'traits.account_id'].includes(attributes.name)) {
    return null
  }

  return (
    <fieldset className={className}>
      {attributes.type !== 'hidden' && (
        <label className={'block text-sm font-medium text-gray-700'} htmlFor={name}>
          {meta.label?.text === 'ID' || attributes.type === 'email'
            ? 'Email Address'
            : meta.label?.text}
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
          hidden={attributes.type === 'hidden'}
          type={type}
          {...extra_attributes}
        />
        {hasError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
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
          key={message.id}
        >
          {message.text}
        </p>
      ))}
    </fieldset>
  )
}

FormField.propTypes = {
  attributes: PropTypes.shape({
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
    type: PropTypes.string.isRequired,
    value: PropTypes.string,
  }),
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      context: PropTypes.shape({ property: PropTypes.string }),
      id: PropTypes.number,
      text: PropTypes.string,
      type: PropTypes.string,
    }),
  ),
  meta: PropTypes.shape({
    label: PropTypes.shape({
      text: PropTypes.string,
    }),
  }),
  type: PropTypes.string.isRequired,
}

export default FormField
export const KratosFields = fields
