import dayjs from 'dayjs'
import logo from '../images/socketkit.svg'
import { client } from '../helpers/is-authorized.js'
import { endpoints } from '../helpers/kratos.js'
import Form from '../components/form/form.js'

/**
 * @param {import("next").NextPageContext} ctx 
 */
 export async function getServerSideProps(ctx) {
  const { flow } = ctx.query

  const redirect = () => {
    ctx.res.statusCode = 302
    ctx.res?.setHeader('Location', endpoints.register)
    return { props: {} }
  }

  if (!flow) { return redirect() }

  try {
    const { data } = await client.getSelfServiceRegistrationFlow(flow)
    const isBefore = dayjs(data?.expires_at).isBefore(dayjs())

    if (isBefore) {
      return redirect()
    }
    return { props: { kratos: data } }
  } catch (error) {
    return redirect()
  }
}

export default function SignUp({ kratos }) {
  const active = kratos?.methods[kratos?.active ?? 'password']?.config ?? {}

  return (
    <>
      <div>
        <img alt="Socketkit, Inc." className="h-12 w-auto" src={logo} />
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Create an account
        </h2>
      </div>
      <div className="mt-8">
        <Form
          active={kratos?.active ?? 'password'}
          formClassName="space-y-6"
          labelClassName="block text-sm font-medium text-gray-700"
          inputClassName="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          {...active}
        />
      </div>
    </>
  )
}
