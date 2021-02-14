import Link from 'next/link'
import dayjs from 'dayjs'
import FormField, { KratosFields } from '../components/form/field'
import LoginProviderForm from '../components/form/login-provider'
import Button from '../components/form/button'
import { client } from '../helpers/is-authorized.js'
import { endpoints } from '../helpers/kratos.js'
// @ts-ignore
import logo from '../images/socketkit.svg'

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

  if (!flow) { return redirect() }

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
  const action = kratos?.methods.password.config.action
  const fields = kratos?.methods.password.config.fields ?? []
  const messages = kratos?.methods.password.config.messages ?? []
  const oidc = kratos?.methods.oidc.config ?? {}

  return (
    <>
      <div>
        <img alt="Socketkit, Inc." className="h-12 w-auto" src={logo} />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-gray-600 max-w">
          Or
          <Link href="/signup">
            <a className="font-medium text-orange-600 hover:text-orange-500 px-2">
              start your 14-day free trial
            </a>
          </Link>
        </p>
      </div>
      <div className="mt-8">
        <div>
          <div>
            <LoginProviderForm {...oidc} />
          </div>
        </div>

        <div className="mt-6 relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6">
          <form className="space-y-6" action={action} method="POST">
            {fields
              .map((f) => ({ ...f, ...(KratosFields[f.name] ?? {}) }))
              .sort((a, b) => a.order - b.order)
              .map((field) => (
                <FormField
                  {...field}
                  key={field.name}
                  labelClassName="block text-sm font-medium text-gray-700"
                  inputClassName="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              ))}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  name="remember_me"
                  type="checkbox"
                />
                <label
                  className="ml-2 block text-sm text-gray-900"
                  htmlFor="remember_me"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link href="/recover-account">
                  <a className="font-medium text-orange-600 hover:text-orange-500">
                    Forgot your password?
                  </a>
                </Link>
              </div>
            </div>
            <div>
              <Button loading={false}>Sign in</Button>
              {messages.map((message) => (
                <p
                  key={message.id}
                  className="font-medium text-sm mt-2 text-center text-orange-600"
                >
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