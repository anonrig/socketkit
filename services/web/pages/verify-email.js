import Form from 'components/form/form'
import dayjs from 'dayjs'

import { client } from 'helpers/kratos'
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

    const { data } = await client.getSelfServiceVerificationFlow(
      ctx.query.flow,
      ctx.req?.headers.cookie,
    )

    if (dayjs().isAfter(dayjs(data.expires_at ?? undefined))) {
      throw new Error('Flow expired')
    }

    if (['passed_challenge', 'sent_email'].includes(data.state)) {
      throw new Error('Requirement already fulfilled')
    }

    return { props: { kratos: data } }
  } catch (error) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
}

function VerifyEmail({ kratos }) {
  return (
    <>
      <NextSeo title="Verify Email" />

      <div className="bg-white flex">
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 mb-8">Verify Email</h2>
            <Form
              actions={{
                primary: 'Send verification email',
              }}
              kratos={kratos}
            />
          </div>
        </div>
      </div>
    </>
  )
}

VerifyEmail.propTypes = { kratos: KratosPropTypes }

export default VerifyEmail
