import PropTypes from 'prop-types'
import Link from 'next/link'
import cx from 'classnames'

import FormField, { KratosFields } from 'components/form/field.js'
import Github from 'components/providers/github.js'
import Gitlab from 'components/providers/gitlab.js'
import Button from 'components/form/button.js'

function Form({ actions, kratos, preAction }) {
  const nodes =
    kratos?.ui.nodes.filter((m) => m.group !== 'oidc' && m.attributes.type !== 'submit') ?? []
  const oidcProviders = kratos?.ui.nodes.filter((m) => m.group === 'oidc') ?? []
  const submitButton = kratos?.ui.nodes.find(
    (m) => m.attributes.type === 'submit' && m.group !== 'oidc',
  )

  const providers = () => (
    <form action={kratos.ui.action} method={kratos.ui.method} id="oidc">
      <p className="text-sm font-medium text-gray-700">Sign in with</p>

      <div className="mt-1 grid grid-cols-3 gap-3">
        {oidcProviders.map((field) => (
          <button
            name={field.attributes.name}
            value={field.attributes.value}
            type={field.attributes.type}
            key={field.attributes.value}
            className={
              'w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
            }>
            <span className="sr-only">Sign in with {field.attributes.value}</span>
            {field.attributes.value === 'github' ? <Github /> : <Gitlab />}
          </button>
        ))}
      </div>
      <div className="mt-6 relative mb-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-warmGray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-trueGray-500">Or continue with</span>
        </div>
      </div>
    </form>
  )

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

      {oidcProviders.length > 0 && providers()}

      <form action={kratos.ui.action} method={kratos.ui.method} id="default">
        {nodes
          .map((field) => Object.assign({}, field, KratosFields[field.attributes.name]))
          .sort((a, b) => a.order - b.order)
          .map((field) => (
            <FormField
              key={field.attributes.name}
              {...field.attributes}
              messages={field.messages}
              className={cx(field.attributes.type !== 'hidden' ? 'mb-6' : 'hidden')}
            />
          ))}
        {preAction}

        {submitButton && (
          <Button
            className="w-full"
            type={submitButton?.attributes.type}
            name={submitButton?.attributes.name}
            value={submitButton?.attributes.value}
            disabled={submitButton?.attributes.disabled}>
            {actions.primary}
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
