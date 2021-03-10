import PropTypes from 'prop-types'
import FormField, { KratosFields } from './field'
import Button from './button'
import Link from 'next/link'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

function Form({ actions, kratos, preAction }) {
  const methodKeys = Object.keys(kratos.methods).filter((m) => m !== 'oidc')
  const { config } = kratos.methods[methodKeys[0]]

  useEffect(() => {
    if (config.messages?.length > 0) {
      config.messages?.forEach((m) => {
        toast(m.text, {
          duration: 10000,
          role: 'alert',
          ariaLive: 'assertive',
          type: m.type,
          id: m.id,
        })
      })
    }
  }, [config.messages])

  return (
    <form className={'space-y-6'} action={config.action} method={config.method}>
      {(config.fields ?? [])
        .map((f) => ({ ...f, ...(KratosFields[f.name] ?? {}) }))
        .sort((a, b) => a.order - b.order)
        .map((field) => (
          <FormField key={field.name} {...field} />
        ))}
      {preAction}
      <div>
        <Button loading={false} type="submit">
          {actions.primary}
        </Button>

        {actions.secondary && (
          <Link href={actions.secondary.href}>
            <a className="text-sm text-warmGray-900 w-full flex justify-center pt-4">
              {actions.secondary.label}
            </a>
          </Link>
        )}
      </div>
      <div>
        {config.messages?.map((message) => (
          <p key={message.id} className="font-medium text-sm mt-2 text-center text-red-600">
            {message.text}
          </p>
        ))}
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
}

export default Form
