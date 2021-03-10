import dayjs from 'dayjs'
import Image from 'next/image'
import FormField, { KratosFields } from 'components/form/field'
import LoginProviderForm from 'components/form/login-provider'
import Button from 'components/form/button'
import { client } from 'helpers/is-authorized.js'
import { endpoints } from 'helpers/kratos.js'

/**
 * @param {import("next").NextPageContext} ctx
 */
export async function getServerSideProps(ctx) {
  const { flow } = ctx.query

  const redirect = () => {
    ctx.res.statusCode = 302
    ctx.res?.setHeader('Location', endpoints.login)
    return { props: {} }
  }

  if (!flow) {
    return redirect()
  }

  try {
    const { data } = await client.getSelfServiceLoginFlow(flow)
    const isBefore = dayjs(data?.expires_at).isBefore(dayjs())

    if (isBefore) {
      return redirect()
    }
    return { props: { kratos: data } }
  } catch (error) {
    return redirect()
  }
}

export default function SignIn({ kratos }) {
  const { action, fields, method, messages } = kratos?.methods.password.config ?? {}
  const oidc = kratos?.methods.oidc.config ?? {}

  return (
    <>
      <div>
        <Image alt="Socketkit, Inc" src="/socketkit-icon.svg" width={50} height={50} />
        <h2 className="mt-6 text-3xl font-extrabold text-warmGray-900">Sign in</h2>
        <p className="mt-2 text-sm text-trueGray-500 max-w">
          or{' '}
          <a
            className="font-semibold text-orange-500 hover:text-orange-400"
            href={endpoints.register}>
            start your 14-day free trial
          </a>
        </p>
      </div>
      <div className="mt-8">
        <LoginProviderForm {...oidc} />

        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-warmGray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-trueGray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6">
          <form className="space-y-6" action={action} method={method}>
            {fields
              ?.map((f) => ({ ...f, ...(KratosFields[f.name] ?? {}) }))
              .sort((a, b) => a.order - b.order)
              .map((field) => (
                <FormField
                  {...field}
                  key={field.name}
                  labelClassName="block text-sm font-medium text-gray-700"
                  inputClassName="appearance-none block w-full px-3 py-2 border border-warmGray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              ))}
            <div className="flex items-center justify-between">
              <div></div>
              <a
                href={endpoints.recover}
                className="font-medium text-orange-500 hover:text-orange-400 text-sm">
                Forgot your password?
              </a>
            </div>
            <div>
              <Button loading={false}>Sign in</Button>
              {messages?.map((message) => (
                <p
                  key={message.id}
                  className="font-medium text-sm mt-2 text-center text-orange-500">
                  {message.text}
                </p>
              ))}
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
