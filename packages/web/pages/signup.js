import * as Sentry from '@sentry/nextjs'
import dayjs from 'dayjs'
import { NextSeo } from 'next-seo'
import Form from 'components/form/form.js'

import { endpoints, client } from 'helpers/kratos.js'
import KratosPropTypes from 'helpers/types/kratos.js'

export async function getServerSideProps(ctx) {
  const { flow } = ctx.query

  const redirect = () => {
    ctx.res.statusCode = 302
    ctx.res?.setHeader('Location', endpoints.register)
    return { props: {} }
  }

  if (!flow) {
    return redirect()
  }

  try {
    const { data } = await client.getSelfServiceRegistrationFlow(flow, ctx.req.headers.cookie)
    const isBefore = dayjs(data?.expires_at ?? undefined).isBefore(dayjs())

    if (isBefore) {
      return redirect()
    }
    return { props: { kratos: data } }
  } catch (error) {
    Sentry.captureException(error)
    return redirect()
  }
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
            label: 'Go back to login',
            href: endpoints.login,
          },
        }}
        kratos={kratos}
      />
    </>
  )
}

SignUp.propTypes = { kratos: KratosPropTypes }

export default SignUp
