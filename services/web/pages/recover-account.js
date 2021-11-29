import Form from 'components/form/form.js'
import dayjs from 'dayjs'

import { endpoints, client } from 'helpers/kratos.js'
import KratosPropTypes from 'helpers/types/kratos.js'
import { NextSeo } from 'next-seo'

/**
 * @param {import('next').NextPageContext} ctx
 */
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
    const { data } = await client.getSelfServiceRecoveryFlow(flow, ctx.req?.headers.cookie)
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
      <NextSeo title="Recover Account" />

      <h2 className="text-3xl font-extrabold text-gray-900">Recover Account</h2>
      <div className="mt-8">
        <Form
          actions={{
            primary: 'Send reset email',
            secondary: {
              href: endpoints.login,
              label: 'Go back to login',
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
