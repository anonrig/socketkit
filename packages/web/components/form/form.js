import PropTypes from 'prop-types'
import FormField, { KratosFields } from './field'
import Button from './button'
import Link from 'next/link'

function Form({ actions, kratos, preAction }) {
  const methodKeys = Object.keys(kratos.methods).filter((m) => m !== 'oidc')
  const { config } = kratos.methods[methodKeys[0]]

  return (
    <form className={'space-y-6'} action={config.action} method={config.method}>
      <div>
        {config.messages?.map((message) => (
          <p key={message.id} className="font-medium text-sm mt-2 text-left text-red-500">
            {message.text}
          </p>
        ))}
      </div>
      {(config.fields ?? [])
        .map((f) => ({ ...f, ...(KratosFields[f.name] ?? {}) }))
        .sort((a, b) => a.order - b.order)
        .map((field) => (
          <FormField key={field.name} {...field} />
        ))}
      {preAction}
      <div>
        <Button type="submit">{actions.primary}</Button>

        {actions.secondary && (
          <Link href={actions.secondary.href}>
            <a className="text-sm text-warmGray-900 w-full flex justify-center pt-4">
              {actions.secondary.label}
            </a>
          </Link>
        )}
      </div>
    </form>
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
