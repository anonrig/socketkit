import Form from 'components/form/form'
import dayjs from 'dayjs'

import { endpoints, client } from 'helpers/kratos'
import KratosPropTypes from 'helpers/types/kratos'
import { NextSeo } from 'next-seo'

/**
 * @param {import('next').NextPageContext} ctx
 */
export async function getServerSideProps(ctx) {
  if (!ctx.query.flow) {
    throw new Error('Flow does not exist')
  }

  const { data } = await client.getSelfServiceRegistrationFlow(
    ctx.query.flow,
    ctx.req?.headers.cookie,
  )
  const isBefore = dayjs(data?.expires_at ?? undefined).isBefore(dayjs())

  if (isBefore) {
    throw new Error('Flow expired')
  }

  return { props: { kratos: data } }
}

function SignUp({ kratos }) {
  return (
    <>
      <NextSeo
        title="Sign Up"
        description="Sign up to Socketkit Mobile Analytics and Subscription Tracking web panel and create a new account."
      />

      <h2 className="mt-6 text-3xl font-extrabold text-gray-900 mb-8">Create an account</h2>
      <Form
        actions={{
          primary: 'Sign in',
          secondary: {
            href: endpoints.login,
            label: 'Go back to login',
          },
        }}
        kratos={kratos}
      />
    </>
  )
}

SignUp.propTypes = { kratos: KratosPropTypes }

export default SignUp
