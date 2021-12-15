import Form from 'components/form/form'
import dayjs from 'dayjs'

import { endpoints, client } from 'helpers/kratos'
import KratosPropTypes from 'helpers/types/kratos'
import { NextSeo } from 'next-seo'

/**
 * @param {import('next').NextPageContext} ctx
 */
export async function getServerSideProps(ctx) {
  try {
    if (!ctx.query.flow) {
      throw new Error('Flow does not exist')
    }

    const { data } = await client.getSelfServiceRecoveryFlow(
      ctx.query.flow,
      ctx.req?.headers.cookie,
    )
    const isBefore = dayjs(data?.expires_at ?? undefined).isBefore(dayjs())

    if (isBefore) {
      throw new Error('Flow expired')
    }

    return { props: { kratos: data } }
  } catch (error) {
    return {
      redirect: {
        destination: endpoints.recover,
        permanent: false,
      },
    }
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
