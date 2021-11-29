import Form from 'components/form/form'
import dayjs from 'dayjs'

import { endpoints, client } from 'helpers/kratos'
import KratosPropTypes from 'helpers/types/kratos'
import { NextSeo } from 'next-seo'

/**
 * @param {import('next').NextPageContext} ctx Context
 */
export async function getServerSideProps(ctx) {
  try {
    if (!ctx.query.flow) {
      throw new Error('Flow does not exist')
    }

    const { data } = await client.getSelfServiceLoginFlow(ctx.query.flow, ctx.req.headers.cookie)
    const isBefore = dayjs(data?.expires_at ?? undefined).isBefore(dayjs())

    if (isBefore) {
      throw new Error('Flow expired')
    }

    return { props: { kratos: data } }
  } catch (error) {
    return {
      redirect: {
        destination: endpoints.login,
        permanent: false,
      },
    }
  }
}

function SignIn({ kratos }) {
  return (
    <>
      <NextSeo
        title="Sign In"
        description="Sign in to Socketkit Mobile Analytics and Subscription Tracking web panel."
      />

      <h2 className="text-3xl font-extrabold text-warmGray-900">Sign in</h2>
      <p className="mt-2 text-sm text-trueGray-500 max-w mb-8">
        or{' '}
        <a
          className="font-semibold text-orange-500 hover:text-orange-400"
          href={endpoints.register}
        >
          start your 14-day free trial
        </a>
      </p>

      <Form
        preAction={
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <a
              href={endpoints.recover}
              className="font-medium text-orange-500 hover:text-orange-400 text-sm"
            >
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

SignIn.propTypes = { kratos: KratosPropTypes }

export default SignIn
