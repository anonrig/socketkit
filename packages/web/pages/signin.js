import dayjs from 'dayjs'
import Form from 'components/form/form.js'
import LoginProviderForm from 'components/form/login-provider'
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
  const oidc = kratos?.methods.oidc.config ?? {}

  return (
    <>
      <h2 className="text-3xl font-extrabold text-warmGray-900">Sign in</h2>
      <p className="mt-2 text-sm text-trueGray-500 max-w mb-8">
        or{' '}
        <a
          className="font-semibold text-orange-500 hover:text-orange-400"
          href={endpoints.register}>
          start your 14-day free trial
        </a>
      </p>
      <LoginProviderForm {...oidc} />

      <div className="mt-6 relative mb-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-warmGray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-trueGray-500">Or continue with</span>
        </div>
      </div>

      <Form
        preAction={
          <div className="flex items-center justify-between">
            <div></div>
            <a
              href={endpoints.recover}
              className="font-medium text-orange-500 hover:text-orange-400 text-sm">
              Forgot your password?
            </a>
          </div>
        }
        actions={{
          primary: 'Sign in',
          secondary: null,
        }}
        kratos={kratos}
      />
    </>
  )
}
