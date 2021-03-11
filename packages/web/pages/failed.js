import { client } from '../helpers/is-authorized.js'
import pkg from '../package.json'

/**
 * @param {import("next").NextPageContext} ctx
 */
export async function getServerSideProps(ctx) {
  const { error } = ctx.query

  const redirect = () => {
    ctx.res.statusCode = 302
    ctx.res?.setHeader('Location', 'https://web.socketkit.com')
    return { props: {} }
  }

  if (!error) {
    return redirect()
  }

  try {
    const { data } = await client.getSelfServiceError(error)

    if (data.errors.length == 0) {
      return redirect()
    }

    return {
      props: {
        data: {
          reason: data.errors[0].reason,
          status: data.errors[0].status,
        },
      },
    }
  } catch (error) {
    return redirect()
  }
}

export default function Failed({ data }) {
  return (
    <>
      <h2 className="text-3xl font-extrabold text-gray-900">
        {data.status} (v{pkg.version})
      </h2>
      <p className="mt-2 text-sm text-gray-600 max-w">
        We're working really hard to fix this issue. <br></br>{data.reason}
      </p>
    </>
  )
}
