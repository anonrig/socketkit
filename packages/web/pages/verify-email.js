import dayjs from 'dayjs'
import Form from '../components/form/form.js'
import { client } from '../helpers/is-authorized.js'

/**
 * @param {import("next").NextPageContext} ctx
 */
export async function getServerSideProps(ctx) {
  const { flow } = ctx.query

  const redirect = () => {
    ctx.res.statusCode = 302
    ctx.res?.setHeader('Location', '/')
    return { props: {} }
  }

  if (!flow) {
    return redirect()
  }

  try {
    const { data } = await client.getSelfServiceVerificationFlow(flow)

    if (dayjs().isAfter(dayjs(data.expires_at))) {
      return redirect()
    }

    if (['passed_challenge', 'sent_email'].includes(data.state)) {
      return redirect()
    }

    return { props: { kratos: data } }
  } catch (error) {
    return redirect()
  }
}

function VerifyEmail({ kratos }) {
  return (
    <>
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

export default VerifyEmail
