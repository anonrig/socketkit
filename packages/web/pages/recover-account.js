import dayjs from 'dayjs'
import { endpoints } from '../helpers/kratos.js'
import { client } from '../helpers/is-authorized.js'
import FormField, { KratosFields } from '../components/form/field.js'
import Button from '../components/form/button.js'
import logo from '../images/icon-socketkit.svg'

/**
 * @param {import("next").NextPageContext} ctx 
 */
 export async function getServerSideProps(ctx) {
  const { flow } = ctx.query

  const redirect = () => {
    ctx.res.statusCode = 302
    ctx.res?.setHeader('Location', endpoints.recover)
    return { props: {} }
  }

  if (!flow) { return redirect() }

  try {
    const { data } = await client.getSelfServiceRecoveryFlow(flow)
    const isBefore = dayjs(data?.expires_at).isBefore(dayjs())

    if (isBefore) {
      return redirect()
    }
    return { props: { kratos: data } }
  } catch (error) {
    return redirect()
  }
}

export default function RecoverAccount({ kratos }) {
  const action = kratos?.methods.link.config.action
  const fields = kratos?.methods.link.config.fields ?? []
  const messages = kratos?.messages ?? []

  return (
    <>
      <div>
        <img alt="Socketkit, Inc." className="h-12 w-auto" src={logo} />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Recover Account
        </h2>
      </div>
      <div className="mt-8">
        <div className="mt-6">
          <form className="space-y-6" action={action} method="POST">
            {fields
              .map((f) => ({ ...f, ...(KratosFields[f.name] ?? {}) }))
              .sort((a, b) => a.order - b.order)
              .map((field) => (
                <FormField
                  key={field.name}
                  {...field}
                  labelClassName="block text-sm font-medium text-gray-700"
                  inputClassName="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                />
              ))}
            <div>
              {messages.map((message) => (
                <p
                  key={message.id}
                  className="font-medium text-sm mt-2 text-center text-orange-600"
                >
                  {message.text}
                </p>
              ))}
            </div>
            <div>
              <Button loading={false} type="submit">
                Send reset email
              </Button>
              <a
                className="text-sm text-gray-700 w-full flex justify-center pt-4"
                href={endpoints.login}
              >
                Go back to login
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
