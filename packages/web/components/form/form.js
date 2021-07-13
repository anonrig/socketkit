import PropTypes from 'prop-types'
import Link from 'next/link'
import cx from 'classnames'

import FormProviders from 'components/form/form-providers.js'
import FormField, { KratosFields } from 'components/form/field.js'
import Button from 'components/form/button.js'

function Form({ actions, kratos, preAction }) {
  const nodes = kratos?.ui.nodes.filter((m) => m.attributes.type !== 'submit') ?? []

  const oidc_group = kratos?.ui.nodes.filter((m) => m.group === 'oidc')
  const password_group = kratos?.ui.nodes.filter((m) => m.group === 'password')

  const login_with_provider = oidc_group.find((m) => m.attributes.type === 'submit')
  const login_with_password = password_group.find((m) => m.attributes.type === 'submit')

  const action_button = login_with_password ?? login_with_provider

  return (
    <>
      {kratos?.ui.messages?.map((message) => (
        <p
          key={message.id}
          className={`font-medium text-sm mt-2 text-left mb-4 ${
            message.type === 'error' ? 'text-red-500' : ''
          }`}>
          {message.text}
        </p>
      ))}

      {oidc_group.length > 0 && login_with_password && (
        <FormProviders
          oidc_group={oidc_group}
          method={kratos.ui.method}
          action={kratos.ui.action}
        />
      )}

      <form action={kratos.ui.action} method={kratos.ui.method} id="default">
        {nodes.map((field) => (
          <FormField
            key={field.attributes.name}
            {...field}
            className={cx(field.attributes.type !== 'hidden' ? 'mb-6' : 'hidden')}
          />
        ))}
        {preAction}

        {action_button && (
          <Button
            className="w-full"
            type={action_button?.attributes.type}
            name={action_button?.attributes.name}
            value={action_button?.attributes.value}
            disabled={action_button?.attributes.disabled}>
            {action_button?.meta?.label?.text ?? actions.primary}
          </Button>
        )}

        {actions.secondary && (
          <Link href={actions.secondary.href}>
            <a className="text-sm text-warmGray-900 w-full flex justify-center pt-4">
              {actions.secondary.label}
            </a>
          </Link>
        )}
      </form>
    </>
  )
}

Form.propTypes = {
  actions: PropTypes.shape({
    primary: PropTypes.string.isRequired,
    secondary: PropTypes.shape({
      label: PropTypes.string,
      href: PropTypes.string,
    }),
  }).isRequired,
  kratos: PropTypes.any.isRequired,
  preAction: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  ),
}

export default Form
