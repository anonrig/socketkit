import dayjs from 'dayjs'
import Form from 'components/form/form.js'

import { endpoints } from 'helpers/kratos.js'
import { client } from 'helpers/is-authorized.js'
import KratosPropTypes from 'helpers/types/kratos.js'

export async function getServerSideProps(ctx) {
  const { flow } = ctx.query

  const redirect = () => {
    ctx.res.statusCode = 302
    ctx.res?.setHeader('Location', endpoints.recover)
    return { props: {} }
  }

  if (!flow) {
    return redirect()
  }

  try {
    const { data } = await client.getSelfServiceRecoveryFlow(flow)
    const isBefore = dayjs(data?.expires_at ?? undefined).isBefore(dayjs())

    if (isBefore) {
      return redirect()
    }
    return { props: { kratos: data } }
  } catch (error) {
    return redirect()
  }
}

function RecoverAccount({ kratos }) {
  return (
    <>
      <h2 className="text-3xl font-extrabold text-gray-900">Recover Account</h2>
      <div className="mt-8">
        <Form
          actions={{
            primary: 'Send reset email',
            secondary: {
              label: 'Go back to login',
              href: endpoints.login,
            },
          }}
          kratos={kratos}
        />
      </div>
    </>
  )
}

RecoverAccount.propTypes = { kratos: KratosPropTypes }

export default RecoverAccount
